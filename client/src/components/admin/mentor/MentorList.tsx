"use client"
import { FC } from 'react';
import { motion } from 'framer-motion';
import MentorTable from './MentorTable';
import { IMentor } from '@/src/types/mentorTypes';

const MotionH1 = motion('h1');

interface MentorListProps {
  mentors: IMentor[];
}

const MentorList: FC<MentorListProps> = ({ mentors }) => {
  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <MotionH1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-4 md:mb-0"
          >
            Mentor Management
          </MotionH1>
          {/* <div className="flex items-center space-x-4">
            <ApplyMentorButton />
          </div> */}
        </div>
        <MentorTable theme="light" />
      </div>
    </div>
  );
};

export default MentorList;
