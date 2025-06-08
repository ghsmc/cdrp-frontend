import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CDRP</span>
            </div>
            <p className="text-gray-600 text-sm">
              The Crisis Data Response Platform enables first responders and emergency management teams to 
              coordinate disaster relief efforts effectively through real-time data visualization and 
              collaborative response management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-sm text-gray-600 hover:text-gray-900">
                  Heat Map
                </Link>
              </li>
              <li>
                <Link href="/requests" className="text-sm text-gray-600 hover:text-gray-900">
                  Emergency Requests
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-gray-600 hover:text-gray-900">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About CDRP
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-sm text-gray-600 hover:text-gray-900">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-sm text-gray-600 hover:text-gray-900">
                  Training Materials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Crisis Data Response Platform. 
            Developed to support disaster response efforts worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}