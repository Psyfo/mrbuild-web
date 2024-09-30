import Image from 'next/image';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const BranchMap: React.FC = () => {
  // Dynamically import the LeafletMap component with SSR disabled
  const LeafletMap = dynamic(() => import('./LeafletMap/LeafletMap'), {
    ssr: false,
  });

  const branches = [
    {
      branchName: 'Mr. Build Tzaneen',
      address1: 'Corner Danie Joubert',
      address2: 'Claude Wheatley St, Tzaneen, 0850',
      telephone: '015 004 0560',
      email: 'tzaneen@mrbuild.co.za',
      lat: -23.831000495266885,
      long: 30.164830483251983,
    },
    {
      branchName: 'Mr. Build Louis Trichard',
      address1: 'Cnr Rissik & Grobler Straat',
      address2: 'Louis Trichardt, 0920',
      telephone: '015 004 0168',
      email: 'Louistrichardt@mrbuild.co.za',
      lat: -23.049124228049475,
      long: 29.910482873433757,
    },
    {
      branchName: 'Mr. Build Musina',
      address1: '6 Pat Harrison Rd',
      address2: 'Musina, 0900',
      telephone: '015 004 1031',
      email: 'musina@mrbuild.co.za',
      lat: -22.35601137585995,
      long: 30.03158562369095,
    },
    {
      branchName: 'Mr. Build Giyani',
      address1: 'Giyani-BA',
      address2: 'Giyani, 0826',
      telephone: '015 812 3786',
      email: 'giyani@mrbuild.co.za',
      lat: -23.30823395934613,
      long: 30.693532532078933,
    },
    {
      branchName: 'Mr. Build Sibasa',
      address1: '204 Makhado Rd Sibasa',
      address2: 'Sibasa, 0970',
      telephone: '015 963 3856',
      email: 'sibasa@mrbuild.co.za',
      lat: -22.947322465454207,
      long: 30.468803054391653,
    },
    {
      branchName: 'Mr. Build Thohoyandou',
      address1: '90/91 B.A MUNICIPALITY',
      address2: 'Thohoyandou, 0950',
      telephone: '015 962 0444',
      email: 'thohoyandou@mrbuild.co.za',
      lat: -22.97051832689911,
      long: 30.461899383227742,
    },
    {
      branchName: 'The Builder Thohoyandou',
      address1: 'Cnr Rissik & Grobler Straat',
      address2: 'Louis Trichardt, 0920',
      telephone: '015 962 5545',
      email: 'thohoyandou@thebuilder.co.za',
      lat: -23.049124228049475,
      long: 29.910482873433757,
    },
    {
      branchName: 'The Builder Giyani',
      address1: '22BA, Next to Mopani Depot',
      address2: 'Giyani, 0826',
      telephone: '015 004 0561',
      email: 'giyani@thebuilder.co.za',
      lat: -23.30520029500934,
      long: 30.68955769152215,
    },
  ];

  const [selectedBranch, setSelectedBranch] = useState<unknown | null>(null);

  const handleGetDirections = (lat: number, long: number) => {
    setSelectedBranch({ lat, long });
  };

  return (
    <div className='relative w-full h-[80vh]'>
      {/* Map Component */}
      <div className='absolute z-0 top-0 left-0 bg-white w-full h-[65%] lg:h-full'>
        <LeafletMap branches={branches} selectedBranch={selectedBranch} />
      </div>

      {/* Scrolling Branch List */}
      <div className='absolute bottom-0 left-0 lg:top-0 z-10 flex flex-col items-center px-4 py-4 lg:py-8  w-full lg:w-[40%] rounded-t-3xl lg:rounded-tl-none max-h-[40%] lg:max-h-none bg-mbRed overflow-y-scroll font-dinot text-4 lg:text-8 text-white '>
        <div className='border-[2px] border-white bg-white w-16 h-auto mb-4 divider divide-white lg:hidden'></div>
        {/* Scrolling list */}
        <div className='flex flex-col items-center overflow-y-scroll scrollable scrollbar-custom pr-[2rem] lg:pr-[5rem]'>
          {branches.map((branch, index) => (
            <div
              className='flex w-full mt-8 items-start gap-[25px]'
              key={index}
            >
              <Image
                src='/images/logo_mrbuild.svg'
                alt='Mr Build Logo'
                width={52}
                height={57}
                className='w-[52px]'
              />
              <div className=''>
                <h2 className='font-bold text-[24px] lg:text-[34px] leading-none'>
                  {branch.branchName}
                </h2>
                <p>{branch.address1}</p>
                <p>{branch.address2}</p>
                <p>{branch.telephone}</p>
                <p>{branch.email}</p>
                <p className='mt-4 font-bold opacity-60 uppercase underline'>
                  <a
                    onClick={() => handleGetDirections(branch.lat, branch.long)}
                  >
                    Get Directions
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchMap;
