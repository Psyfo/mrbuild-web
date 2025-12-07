import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */

const LeafletMap = ({ branches, selectedBranch }: any) => {
  const customIcon = L.icon({
    iconUrl: '/images/logo_mrbuild.svg',
    iconSize: [52, 57],
  });

  // Fly to the selected branch when it changes
  const FlyToLocation = ({ lat, long }: any) => {
    const map = useMap();
    useEffect(() => {
      if (lat && long) {
        // Use flyTo with animation options for smooth transitions
        map.flyTo([lat, long], 13, { animate: true, duration: 1.5 }); // Adjust duration as needed
      }
    }, [lat, long, map]);
    return null;
  };

  return (
    <MapContainer
      center={[-23.831000495266885, 30.164830483251983]}
      zoom={8}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {branches.map((branch: any, index: any) => (
        <Marker
          key={index}
          position={[branch.lat, branch.long]}
          icon={customIcon}
        >
          <Popup>
            <div>
              <h2>{branch.branchName}</h2>
              <p>{branch.address1}</p>
              <p>{branch.address2}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {selectedBranch && (
        <FlyToLocation lat={selectedBranch.lat} long={selectedBranch.long} />
      )}
    </MapContainer>
  );
};

export default LeafletMap;
