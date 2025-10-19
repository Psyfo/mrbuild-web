'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { IBranch } from '@/types/branch';

// Dynamically import the LeafletMap component with SSR disabled
const LeafletMap = dynamic(() => import('./LeafletMap/LeafletMap'), {
  ssr: false,
});

const BranchMap: React.FC = () => {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<unknown | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/branches');
        if (!response.ok) throw new Error('Failed to fetch branches');
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Handle expanding/collapsing the branches tab
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle "Get Directions" click
  const handleGetDirections = (lat: number, long: number) => {
    setSelectedBranch({ lat, long });
    setIsExpanded(false);
  };

  // Map branches to format expected by LeafletMap
  const mappedBranches = branches.map((branch) => ({
    branchName: branch.branchName,
    address1: branch.address1,
    address2: branch.address2 || `${branch.city}, ${branch.postalCode}`,
    telephone: branch.telephone,
    email: branch.email,
    lat: branch.coordinates.latitude,
    long: branch.coordinates.longitude,
  }));

  if (loading) {
    return (
      <div className='flex justify-center items-center bg-white w-full h-[80vh]'>
        <p className='text-gray-600'>Loading branches...</p>
      </div>
    );
  }

  return (
    <div className='relative w-full h-[80vh]'>
      {/* Map Component */}
      <div className='top-0 left-0 z-0 absolute bg-white w-full h-[65%] lg:h-full'>
        <LeafletMap branches={mappedBranches} selectedBranch={selectedBranch} />
      </div>

      {/* Scrolling Branch List */}
      <motion.div
        drag='y'
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        onDrag={(event, info) => {
          if (info.offset.y < -30) {
            setIsExpanded(true); // Expand on upward drag
          } else if (info.offset.y > 30) {
            setIsExpanded(false); // Collapse on downward drag
          } else {
            setIsExpanded(isExpanded); // Maintain current state
          }
        }}
        id='branches-tab'
        className={`absolute bottom-0 left-0 lg:top-0 z-10 flex flex-col items-center px-4 py-4 lg:py-8 w-full lg:w-[40%] rounded-t-3xl lg:rounded-tl-none ${
          isExpanded
            ? 'max-h-[80%] lg:max-h-[100%]'
            : 'max-h-[40%] lg:max-h-[100%]'
        } lg:max-h-none bg-mbRed overflow-y-scroll font-dinot text-4 lg:text-8 text-white transition-all duration-500 ease-in-out`}
        onClick={handleExpand} // Toggle height on click anywhere on the tab
      >
        {/* Tab marker for expanding on mobile (purely decorative now) */}
        <div
          id='tab-marker'
          className='lg:hidden bg-white mb-4 border-[2px] border-white divide-white w-16 h-auto divider'
        ></div>

        {/* Scrolling list */}
        <div className='flex flex-col items-center pr-[2rem] lg:pr-[5rem] overflow-y-scroll scrollable scrollbar-custom'>
          {branches.map((branch, index) => (
            <div
              className='flex items-start gap-[25px] mt-8 w-full'
              key={index}
            >
              <Image
                src='/images/logo_mrbuild.svg'
                alt='Mr Build Logo'
                width={52}
                height={57}
                className='w-[52px]'
              />
              <div className='font-dinot'>
                <h2 className='text-[24px] lg:text-[28px] leading-[40px]'>
                  {branch.branchName}
                </h2>
                <p>{branch.address1}</p>
                <p>{branch.address2}</p>
                <p>{branch.telephone}</p>
                <p>{branch.email}</p>
                <p className='opacity-60 mt-4 underline uppercase'>
                  <a
                    onClick={() =>
                      handleGetDirections(
                        branch.coordinates.latitude,
                        branch.coordinates.longitude
                      )
                    }
                  >
                    Get Directions
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BranchMap;
