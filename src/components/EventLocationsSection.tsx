'use client';

import React from 'react';

interface LocationItem {
  id: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
}

const locations: LocationItem[] = [
  {
    id: 'birmingham',
    city: 'Birmingham',
    addressLine1: 'The Tipu Sultan, 43 Alcester Rd,',
    addressLine2: 'Birmingham B13 8AA',
  },
  {
    id: 'coventry',
    city: 'Coventry',
    addressLine1: 'At The Farmhouse, Coventry',
    addressLine2: 'CV5 6HB',
  },
  {
    id: 'leicester',
    city: 'Leicester',
    addressLine1: 'The Tipu Sultan, 18 The Parade,',
    addressLine2: 'Oadby, Leicester LE2 5BF',
  },
];

export function EventLocationsSection() {
  return (
    <section className="relative z-10 w-full py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#2d2d2d] tracking-tight leading-tight">
            Event Locations
          </h2>
        </div>

        {/* 3-Card Grid Layout matching exact Figma/Image reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-[#F5F5F7] rounded-[24px] sm:rounded-[28px] p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md border border-transparent hover:border-black/5"
            >
              {/* Location Pin Icon in Coral/Orange with Inner Circle Ring */}
              <div className="mb-5 sm:mb-6 flex items-center justify-center">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M16 3C10.4772 3 6 7.47715 6 13C6 20.5 16 29 16 29C16 29 26 20.5 26 13C26 7.47715 21.5228 3 16 3Z"
                    stroke="#F05A47"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="16"
                    cy="13"
                    r="3.5"
                    stroke="#F05A47"
                    strokeWidth="2.4"
                  />
                </svg>
              </div>

              {/* City Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] mb-3">
                {loc.city}
              </h3>

              {/* Address Details */}
              <div className="text-xs sm:text-sm text-[#71717A] leading-relaxed font-normal">
                <p>{loc.addressLine1}</p>
                <p>{loc.addressLine2}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
