import { Search, Clock } from "lucide-react";
import { Input } from "@/src/components/shared/components/ui/input";
import { Button } from "@/src/components/shared/components/ui/button";
import { ISearchSortComponentProps } from "@/src/types/userProps";



export const SearchSortComponent = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}: ISearchSortComponentProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full"
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => setSortBy("newest")}
          variant={sortBy === "newest" ? "default" : "outline"}
          className="rounded-full px-5 py-2"
        >
          <Clock className="h-4 w-4 mr-2" /> Newest
        </Button>
        <Button
          onClick={() => setSortBy("oldest")}
          variant={sortBy === "oldest" ? "default" : "outline"}
          className="rounded-full px-5 py-2"
        >
          <Clock className="h-4 w-4 mr-2" /> Oldest
        </Button>
      </div>
    </div>
  );
};
