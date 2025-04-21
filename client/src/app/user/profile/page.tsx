import Footer from "@/src/components/user/Footer"
import Header from "@/src/components/user/Header"
import ProfileCard from "@/src/components/user/profile/ProfileCard"
import BioCard from "@/src/components/user/profile/BioCard"
import StatsCard from "@/src/components/user/profile/StatsCard"

import ActiveCourses from "@/src/components/user/profile/ActiveCourses"
import ProgressOverview from "@/src/components/user/profile/ProgressOverview"
import Recommendations from "@/src/components/user/profile/Recommendations"
import MentorCard from "@/src/components/user/profile/MentorCard"

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-15">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-4">
         
            <div className="md:col-span-1 space-y-6">
              <ProfileCard />
              <BioCard />
              <StatsCard />
              <MentorCard />
            </div>

            
            <div className="md:col-span-3 space-y-6">
              <ActiveCourses />
              <ProgressOverview />
              <Recommendations />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}