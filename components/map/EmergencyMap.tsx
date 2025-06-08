'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { EmergencyRequest } from '@/types';
import { Layers, Satellite } from 'lucide-react';

interface EmergencyMapProps {
  requests: EmergencyRequest[];
  selectedRequestId?: string;
  onRequestSelect?: (request: EmergencyRequest) => void;
  className?: string;
}

interface MapState {
  center: [number, number];
  zoom: number;
  style: 'default' | 'satellite';
}

export function EmergencyMap({ 
  requests, 
  selectedRequestId, 
  onRequestSelect,
  className = "h-96" 
}: EmergencyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapState, setMapState] = useState<MapState>({
    center: [
      Number(process.env.NEXT_PUBLIC_DEFAULT_MAP_CENTER_LNG) || -98.5795,
      Number(process.env.NEXT_PUBLIC_DEFAULT_MAP_CENTER_LAT) || 39.8283
    ],
    zoom: 4,
    style: 'default'
  });

  // Load map state from URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const params = new URLSearchParams(hash);
        const center = params.get('center')?.split(',').map(Number);
        const zoom = Number(params.get('zoom'));
        const style = params.get('style') as 'default' | 'satellite';
        
        if (center && center.length === 2 && !isNaN(zoom)) {
          setMapState({
            center: [center[0], center[1]],
            zoom,
            style: style || 'default'
          });
        }
      } catch (e) {
        console.warn('Failed to parse map state from URL hash');
      }
    }
  }, []);

  // Save map state to URL hash
  const saveMapState = (newState: Partial<MapState>) => {
    const updatedState = { ...mapState, ...newState };
    setMapState(updatedState);
    
    const params = new URLSearchParams();
    params.set('center', `${updatedState.center[0]},${updatedState.center[1]}`);
    params.set('zoom', updatedState.zoom.toString());
    params.set('style', updatedState.style);
    
    window.location.hash = params.toString();
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const styleUrl = mapState.style === 'satellite' 
      ? process.env.NEXT_PUBLIC_MAPLIBRE_SATELLITE_STYLE_URL 
      : process.env.NEXT_PUBLIC_MAPLIBRE_STYLE_URL;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl || 'https://demotiles.maplibre.org/style.json',
      center: mapState.center,
      zoom: mapState.zoom,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Save state when map moves
    map.current.on('moveend', () => {
      if (!map.current) return;
      const center = map.current.getCenter();
      const zoom = map.current.getZoom();
      saveMapState({
        center: [center.lng, center.lat],
        zoom
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map style
  const switchMapStyle = (newStyle: 'default' | 'satellite') => {
    if (!map.current) return;
    
    const styleUrl = newStyle === 'satellite' 
      ? process.env.NEXT_PUBLIC_MAPLIBRE_SATELLITE_STYLE_URL 
      : process.env.NEXT_PUBLIC_MAPLIBRE_STYLE_URL;
    
    map.current.setStyle(styleUrl || 'https://demotiles.maplibre.org/style.json');
    saveMapState({ style: newStyle });
  };

  // Process emergency requests data for map
  const processRequestsForMap = (requests: EmergencyRequest[]) => {
    const features = requests.map((request, index) => {
      // Add small random offset for overlapping locations
      const duplicateOffsets = requests
        .slice(0, index)
        .filter(r => 
          Math.abs(r.location.lat - request.location.lat) < 0.001 &&
          Math.abs(r.location.lng - request.location.lng) < 0.001
        ).length;
      
      const offset = duplicateOffsets * 0.001;
      
      return {
        type: 'Feature',
        properties: {
          id: request.id,
          title: request.title,
          severity: request.severity,
          status: request.status,
          description: request.description,
          location_name: request.location.address || 'Unknown Location'
        },
        geometry: {
          type: 'Point',
          coordinates: [
            request.location.lng + offset,
            request.location.lat + offset
          ]
        }
      };
    });

    return {
      type: 'FeatureCollection',
      features
    };
  };

  // Add emergency markers to map
  useEffect(() => {
    if (!map.current || !requests.length) return;

    map.current.on('load', () => {
      if (!map.current) return;

      const geojsonData = processRequestsForMap(requests);

      // Add source
      if (map.current.getSource('emergency-requests')) {
        (map.current.getSource('emergency-requests') as maplibregl.GeoJSONSource)
          .setData(geojsonData as any);
      } else {
        map.current.addSource('emergency-requests', {
          type: 'geojson',
          data: geojsonData as any,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });
      }

      // Add cluster circle layer
      if (!map.current.getLayer('clusters')) {
        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'emergency-requests',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              10,
              '#f1c40f',
              20,
              '#e74c3c'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              10,
              30,
              20,
              40
            ]
          }
        });
      }

      // Add cluster count labels
      if (!map.current.getLayer('cluster-count')) {
        map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'emergency-requests',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Open Sans Semibold'],
            'text-size': 12
          },
          paint: {
            'text-color': '#ffffff'
          }
        });
      }

      // Add individual markers
      if (!map.current.getLayer('unclustered-point')) {
        map.current.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'emergency-requests',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': [
              'match',
              ['get', 'severity'],
              'critical', '#dc2626',
              'high', '#ea580c',
              'medium', '#ca8a04',
              'low', '#16a34a',
              '#6b7280'
            ],
            'circle-radius': [
              'case',
              ['==', ['get', 'id'], selectedRequestId || ''],
              12,
              8
            ],
            'circle-stroke-width': [
              'case',
              ['==', ['get', 'id'], selectedRequestId || ''],
              3,
              2
            ],
            'circle-stroke-color': '#ffffff'
          }
        });
      }

      // Add click handlers
      map.current.on('click', 'clusters', (e) => {
        if (!map.current) return;
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties?.cluster_id;
        const source = map.current.getSource('emergency-requests') as maplibregl.GeoJSONSource;
        
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !map.current) return;
          map.current.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: zoom
          });
        });
      });

      map.current.on('click', 'unclustered-point', (e) => {
        if (!e.features?.[0]) return;
        const properties = e.features[0].properties;
        const request = requests.find(r => r.id === properties?.id);
        if (request && onRequestSelect) {
          onRequestSelect(request);
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
      map.current.on('mouseenter', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    });
  }, [requests, selectedRequestId, onRequestSelect]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Style Toggle */}
      <div className="absolute top-4 left-4 glass rounded-lg border border-white/10">
        <button
          onClick={() => switchMapStyle(mapState.style === 'default' ? 'satellite' : 'default')}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-white/[0.05] rounded-lg transition-colors"
        >
          {mapState.style === 'default' ? (
            <>
              <Satellite className="h-4 w-4" />
              Satellite
            </>
          ) : (
            <>
              <Layers className="h-4 w-4" />
              Map
            </>
          )}
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-lg border border-white/10 p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Severity Levels</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-600"></div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}