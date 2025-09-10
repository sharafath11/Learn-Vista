"use client";

import { Input } from "@/src/components/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/src/components/shared/components/ui/select";
import { IMentorCourseFiltersProps } from "@/src/types/mentorProps";
import { useEffect, useState } from "react";

export const CourseFilters = ({
  categories,
  onChange,
}: IMentorCourseFiltersProps) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    onChange({
      search,
      sort,
      category: category === "all" ? "" : category,
    });
  }, [search, sort, category, onChange]);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <Input
        placeholder="Search by course title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Select
        value={sort}
        onValueChange={(val) => setSort(val as "latest" | "oldest")}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories
            .filter((c) => !!c.id && !!c.title)
            .map((category) => (
              <SelectItem key={category.id} value={category.id as string}>
                {category.title}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};
