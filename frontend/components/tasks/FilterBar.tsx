import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export interface FilterState {
  search: string;
  status: string;
  priority: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  onClear: () => void;
}

export function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  // Local state for debounced search
  const [searchValue, setSearchValue] = React.useState(filters.search)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(filters.search)
  }, [filters.search])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onChange({ search: searchValue })
      }
    }, 400) // 400ms debounce
    return () => clearTimeout(timer)
  }, [searchValue, filters.search, onChange])

  const hasActiveFilters = Boolean(
    filters.search || 
    filters.status || 
    filters.priority || 
    filters.sortBy !== 'createdAt' || 
    filters.sortOrder !== 'DESC'
  )

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center p-4 bg-card rounded-lg border border-border shadow-sm">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search tasks by title..." 
          className="pl-9"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-3 items-center">
        <Select 
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="w-[140px]"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </Select>

        <Select 
          value={filters.priority}
          onChange={(e) => onChange({ priority: e.target.value })}
          className="w-[140px]"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>

        <div className="h-6 w-px bg-border hidden sm:block"></div>

        <Select 
          value={`${filters.sortBy}|${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('|') as [string, 'ASC' | 'DESC'];
            onChange({ sortBy, sortOrder });
          }}
          className="w-[180px]"
        >
          <option value="createdAt|DESC">Newest First</option>
          <option value="createdAt|ASC">Oldest First</option>
          <option value="dueDate|ASC">Due Date (Earliest)</option>
          <option value="dueDate|DESC">Due Date (Latest)</option>
          <option value="priority|DESC">Priority (High to Low)</option>
          <option value="priority|ASC">Priority (Low to High)</option>
          <option value="title|ASC">Title (A-Z)</option>
          <option value="title|DESC">Title (Z-A)</option>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            onClick={onClear} 
            className="text-muted-foreground hover:text-foreground px-2"
            title="Clear all filters"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
