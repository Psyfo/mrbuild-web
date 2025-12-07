import 'leaflet/dist/leaflet.css';
import '@/styles/globals.css';

import type { Metadata } from 'next';
import AuthProvider from '@/components/providers/AuthProvider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Mr Build',
  description: 'Mr Build Website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='light'>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://mrbuild.co.za#organization',
                  name: 'MrBuild',
                  url: 'https://mrbuild.co.za',
                  logo: 'https://mrbuild.co.za/images/logo_mrbuild.svg',
                  sameAs: [
                    'https://www.instagram.com/mrbuild_sa',
                    'https://www.facebook.com/mrbuildsa',
                  ],
                },
                // Branches (LocalBusiness)
                {
                  '@type': 'LocalBusiness',
                  parentOrganization: {
                    '@id': 'https://mrbuild.co.za#organization',
                  },
                  name: 'Mr. Build Tzaneen',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Corner Danie Joubert, Claude Wheatley St',
                    addressLocality: 'Tzaneen',
                    postalCode: '0850',
                    addressCountry: 'ZA',
                  },
                  telephone: '+27-15-004-0560',
                  email: 'tzaneen@mrbuild.co.za',
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: -23.831000495266885,
                    longitude: 30.164830483251983,
                  },
                },
                {
                  '@type': 'LocalBusiness',
                  parentOrganization: {
                    '@id': 'https://mrbuild.co.za#organization',
                  },
                  name: 'Mr. Build Louis Trichardt',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Cnr Rissik & Grobler Straat',
                    addressLocality: 'Louis Trichardt',
                    postalCode: '0920',
                    addressCountry: 'ZA',
                  },
                  telephone: '+27-15-004-0168',
                  email: 'Louistrichardt@mrbuild.co.za',
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: -23.049124228049475,
                    longitude: 29.910482873433757,
                  },
                },
                {
                  '@type': 'LocalBusiness',
                  parentOrganization: {
                    '@id': 'https://mrbuild.co.za#organization',
                  },
                  name: 'Mr. Build Musina',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '6 Pat Harrison Rd',
                    addressLocality: 'Musina',
                    postalCode: '0900',
                    addressCountry: 'ZA',
                  },
                  telephone: '+27-15-004-1031',
                  email: 'musina@mrbuild.co.za',
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: -22.35601137585995,
                    longitude: 30.03158562369095,
                  },
                },
                {
                  '@type': 'LocalBusiness',
                  parentOrganization: {
                    '@id': 'https://mrbuild.co.za#organization',
                  },
                  name: 'Mr. Build Giyani',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Giyani-BA',
                    addressLocality: 'Giyani',
                    postalCode: '0826',
                    addressCountry: 'ZA',
                  },
                  telephone: '+27-15-812-3786',
                  email: 'giyani@mrbuild.co.za',
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: -23.30823395934613,
                    longitude: 30.693532532078933,
                  },
                },
                {
                  '@type': 'LocalBusiness',
                  parentOrganization: {
                    '@id': 'https://mrbuild.co.za#organization',
                  },
                  name: 'Mr. Build Sibasa',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '204 Makhado Rd Sibasa',
                    addressLocality: 'Sibasa',
                    postalCode: '0970',
                    addressCountry: 'ZA',
                  },
                  telephone: '+27-15-963-3856',
                  email: 'sibasa@mrbuild.co.za',
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: -22.947322465454207,
                    longitude: 30.468803054391653,
                  },
                },
                {
                  '@type': 'LocalBusiness',
                  parentOrganization: {
                    '@id': 'https://mrbuild.co.za#organization',
                  },
                  name: 'Mr. Build Thohoyandou',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '90/91 B.A MUNICIPALITY',
                    addressLocality: 'Thohoyandou',
                    postalCode: '0950',
                    addressCountry: 'ZA',
                  },
                  telephone: '+27-15-962-0444',
                  email: 'thohoyandou@mrbuild.co.za',
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: -22.97051832689911,
                    longitude: 30.461899383227742,
                  },
                },
                {
                  '@type': 'LocalBusiness',
                  parentOrganization: {
                    '@id': 'https://mrbuild.co.za#organization',
                  },
                  name: 'The Builder Thohoyandou',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '70 Mphepu Street, Main Road',
                    addressLocality: 'Thohoyandou',
                    postalCode: '0950',
                    addressCountry: 'ZA',
                  },
                  telephone: '+27-15-962-5545',
                  email: 'thohoyandou@thebuilder.co.za',
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: -22.98298122138363,
                    longitude: 30.456993058732582,
                  },
                },
                {
                  '@type': 'LocalBusiness',
                  parentOrganization: {
                    '@id': 'https://mrbuild.co.za#organization',
                  },
                  name: 'The Builder Giyani',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '22BA, Next to Mopani Depot',
                    addressLocality: 'Giyani',
                    postalCode: '0826',
                    addressCountry: 'ZA',
                  },
                  telephone: '+27-15-004-0561',
                  email: 'giyani@thebuilder.co.za',
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: -23.30520029500934,
                    longitude: 30.68955769152215,
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
