'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useEffect, useRef } from 'react';

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */

const LeafletMap = ({ branches, selectedBranch }: any) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const customIcon = L.icon({
    iconUrl: '/images/logo_mrbuild.svg',
    iconSize: [52, 57],
  });

  // Initialize map
  useEffect(() => {
    // Only initialize if container exists and map doesn't
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create the map instance
    const map = L.map(mapContainerRef.current, {
      center: [-23.831000495266885, 30.164830483251983],
      zoom: 8,
      scrollWheelZoom: true,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup function - properly remove the map
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle markers
  useEffect(() => {
    if (!mapInstanceRef.current || !branches) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    branches.forEach((branch: any) => {
      const marker = L.marker([branch.lat, branch.long], { icon: customIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(
          `<div>
            <h2>${branch.branchName}</h2>
            <p>${branch.address1}</p>
            <p>${branch.address2}</p>
          </div>`
        );
      markersRef.current.push(marker);
    });
  }, [branches]);

  // Fly to selected branch
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedBranch) return;

    mapInstanceRef.current.flyTo(
      [selectedBranch.lat, selectedBranch.long],
      13,
      { animate: true, duration: 1.5 }
    );
  }, [selectedBranch]);

  return (
    <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
  );
};

export default LeafletMap;
