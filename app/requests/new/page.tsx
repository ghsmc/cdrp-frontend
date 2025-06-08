'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { EmergencyMap } from '@/components/map/EmergencyMap';
import { 
  ArrowLeft,
  Save,
  MapPin,
  AlertTriangle,
  Users,
  FileText,
  Plus,
  X,
  Search,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockUser = {
  id: '1',
  email: 'responder@example.com',
  name: 'Sarah Chen',
  role: 'field_agent' as const,
  region_id: '1',
  created_at: '2024-01-01',
};

const disasterTypes = [
  { id: '1', name: 'Hurricane', description: 'Tropical cyclone' },
  { id: '2', name: 'Earthquake', description: 'Seismic activity' },
  { id: '3', name: 'Flood', description: 'Water overflow' },
  { id: '4', name: 'Wildfire', description: 'Uncontrolled fire' },
  { id: '5', name: 'Tornado', description: 'Rotating windstorm' },
  { id: '6', name: 'Pandemic', description: 'Disease outbreak' },
  { id: '7', name: 'Other', description: 'Other emergency type' }
];

const regions = [
  { id: '1', name: 'Northeast' },
  { id: '2', name: 'Southeast' },
  { id: '3', name: 'Central' },
  { id: '4', name: 'West Coast' },
  { id: '5', name: 'International' }
];

const commonSupplies = [
  'Medical equipment',
  'Insulin',
  'Blood pressure medication',
  'Antibiotics',
  'Bandages',
  'Antiseptic',
  'Pain relievers',
  'IV fluids',
  'Oxygen tanks',
  'Defibrillator',
  'Vaccines',
  'Prescription medications'
];

interface FormData {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | '';
  disaster_type_id: string;
  region_id: string;
  location: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
  estimated_affected_people: string;
  medical_supplies_needed: string[];
  custom_supply: string;
}

export default function NewRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    severity: '',
    disaster_type_id: '',
    region_id: mockUser.region_id || '',
    location: {
      lat: null,
      lng: null,
      address: ''
    },
    estimated_affected_people: '',
    medical_supplies_needed: [],
    custom_supply: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showLocationMap, setShowLocationMap] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationChange = (field: 'lat' | 'lng' | 'address', value: any) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  const addMedicalSupply = (supply: string) => {
    if (!formData.medical_supplies_needed.includes(supply)) {
      setFormData(prev => ({
        ...prev,
        medical_supplies_needed: [...prev.medical_supplies_needed, supply]
      }));
    }
  };

  const removeMedicalSupply = (supply: string) => {
    setFormData(prev => ({
      ...prev,
      medical_supplies_needed: prev.medical_supplies_needed.filter(s => s !== supply)
    }));
  };

  const addCustomSupply = () => {
    if (formData.custom_supply.trim() && !formData.medical_supplies_needed.includes(formData.custom_supply.trim())) {
      addMedicalSupply(formData.custom_supply.trim());
      setFormData(prev => ({ ...prev, custom_supply: '' }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          toast.success('Location detected');
        },
        (error) => {
          toast.error('Failed to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.trim().length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
      if (!formData.severity) {
        newErrors.severity = 'Severity level is required';
      }
      if (!formData.disaster_type_id) {
        newErrors.disaster_type_id = 'Disaster type is required';
      }
    }

    if (stepNumber === 2) {
      if (!formData.location.address.trim()) {
        newErrors.location = 'Location address is required';
      }
      if (!formData.region_id) {
        newErrors.region_id = 'Region is required';
      }
      if (formData.estimated_affected_people && 
          (isNaN(Number(formData.estimated_affected_people)) || Number(formData.estimated_affected_people) < 1)) {
        newErrors.estimated_affected_people = 'Must be a valid number greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Emergency request submitted successfully!');
      router.push('/requests');
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={mockUser} />
      
      <div className="mx-auto px-8 max-w-4xl py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/requests"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Link>
          <div className="h-6 border-l border-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Submit Emergency Request</h1>
            <p className="text-gray-600">Report an emergency that requires immediate attention</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-0.5 ${
                    step > stepNumber ? 'bg-red-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Emergency Details</h2>
                <p className="text-gray-600">Provide basic information about the emergency</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Medical Supply Request - Hurricane Relief"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the emergency situation, what assistance is needed, and any other relevant details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/20 characters minimum</p>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity Level *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'critical', label: 'Critical', desc: 'Life-threatening, immediate response required' },
                      { value: 'high', label: 'High', desc: 'Urgent, response needed within hours' },
                      { value: 'medium', label: 'Medium', desc: 'Important, response needed within 24 hours' },
                      { value: 'low', label: 'Low', desc: 'Non-urgent, can wait for available resources' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="severity"
                          value={option.value}
                          checked={formData.severity === option.value}
                          onChange={(e) => handleInputChange('severity', e.target.value)}
                          className="mt-1 text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <div className={`text-sm font-medium px-2 py-1 rounded ${getSeverityColor(option.value)}`}>
                            {option.label}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.severity && <p className="mt-1 text-sm text-red-600">{errors.severity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disaster Type *
                  </label>
                  <select
                    value={formData.disaster_type_id}
                    onChange={(e) => handleInputChange('disaster_type_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select disaster type</option>
                    {disasterTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {type.description}
                      </option>
                    ))}
                  </select>
                  {errors.disaster_type_id && <p className="mt-1 text-sm text-red-600">{errors.disaster_type_id}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location and Impact */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Location & Impact</h2>
                <p className="text-gray-600">Specify where the emergency is occurring and its scope</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Address *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => handleLocationChange('address', e.target.value)}
                    placeholder="Enter the emergency location address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <MapPin className="h-4 w-4" />
                    Use Current
                  </button>
                </div>
                {formData.location.lat && formData.location.lng && (
                  <p className="text-xs text-green-600 mt-1">
                    Coordinates: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                  </p>
                )}
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region *
                  </label>
                  <select
                    value={formData.region_id}
                    onChange={(e) => handleInputChange('region_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {errors.region_id && <p className="mt-1 text-sm text-red-600">{errors.region_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Affected People
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.estimated_affected_people}
                    onChange={(e) => handleInputChange('estimated_affected_people', e.target.value)}
                    placeholder="Number of people affected"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.estimated_affected_people && <p className="mt-1 text-sm text-red-600">{errors.estimated_affected_people}</p>}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowLocationMap(!showLocationMap)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <MapPin className="h-4 w-4" />
                  {showLocationMap ? 'Hide' : 'Show'} Location on Map
                </button>
                
                {showLocationMap && (
                  <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
                    <EmergencyMap
                      requests={[]}
                      className="h-64"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Medical Supplies and Resources */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Required Resources</h2>
                <p className="text-gray-600">Specify what medical supplies and resources are needed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Medical Supplies Needed
                </label>
                
                {/* Common supplies */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Common medical supplies:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSupplies.map((supply) => (
                      <button
                        key={supply}
                        type="button"
                        onClick={() => addMedicalSupply(supply)}
                        disabled={formData.medical_supplies_needed.includes(supply)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          formData.medical_supplies_needed.includes(supply)
                            ? 'bg-blue-100 text-blue-800 border-blue-300 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {formData.medical_supplies_needed.includes(supply) ? (
                          <>✓ {supply}</>
                        ) : (
                          <>+ {supply}</>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom supply input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={formData.custom_supply}
                    onChange={(e) => handleInputChange('custom_supply', e.target.value)}
                    placeholder="Add custom medical supply..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSupply()}
                  />
                  <button
                    type="button"
                    onClick={addCustomSupply}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                {/* Selected supplies */}
                {formData.medical_supplies_needed.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected supplies:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.medical_supplies_needed.map((supply) => (
                        <span
                          key={supply}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {supply}
                          <button
                            type="button"
                            onClick={() => removeMedicalSupply(supply)}
                            className="hover:text-blue-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Request Summary</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Title:</span> {formData.title}</p>
                  <p><span className="font-medium">Severity:</span> {formData.severity}</p>
                  <p><span className="font-medium">Location:</span> {formData.location.address}</p>
                  {formData.estimated_affected_people && (
                    <p><span className="font-medium">Affected People:</span> {formData.estimated_affected_people}</p>
                  )}
                  {formData.medical_supplies_needed.length > 0 && (
                    <p><span className="font-medium">Supplies:</span> {formData.medical_supplies_needed.length} items</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Continue
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Submit Request
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}