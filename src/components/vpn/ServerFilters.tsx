
import { useState } from 'react';
import { Globe, Signal, SlidersHorizontal, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export type LoadFilter = 'all' | 'low' | 'medium' | 'high';
export type PingFilter = 'all' | 'excellent' | 'good' | 'fair';
export type ServerSort = 'recommended' | 'name' | 'load' | 'ping';

export interface ServerFiltersProps {
  selectedCountry: string | null;
  onCountryChange: (country: string | null) => void;
  countries: string[];
  onLoadFilterChange: (filter: LoadFilter) => void;
  loadFilter: LoadFilter;
  onPingFilterChange: (filter: PingFilter) => void;
  pingFilter: PingFilter;
  onSortChange: (sort: ServerSort) => void;
  sortBy: ServerSort;
  onShowFavoritesOnly: (show: boolean) => void;
  showFavoritesOnly: boolean;
  className?: string;
}

export default function ServerFilters({
  selectedCountry,
  onCountryChange,
  countries,
  loadFilter,
  onLoadFilterChange,
  pingFilter,
  onPingFilterChange,
  sortBy,
  onSortChange,
  showFavoritesOnly,
  onShowFavoritesOnly,
  className
}: ServerFiltersProps) {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  
  // Function to handle filter reset
  const handleResetFilters = () => {
    onCountryChange(null);
    onLoadFilterChange('all');
    onPingFilterChange('all');
    onSortChange('recommended');
    onShowFavoritesOnly(false);
    setIsAdvancedFiltersOpen(false);
  };
  
  // Check if any filter is active
  const hasActiveFilters = 
    selectedCountry !== null || 
    loadFilter !== 'all' || 
    pingFilter !== 'all' || 
    sortBy !== 'recommended' ||
    showFavoritesOnly;
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Country filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          className={cn(
            "flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap",
            selectedCountry === null 
              ? "bg-vpn-blue text-white" 
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
          onClick={() => onCountryChange(null)}
        >
          <Globe className="w-4 h-4" />
          <span>All Countries</span>
        </button>
        
        {countries.map(country => (
          <button
            key={country}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm whitespace-nowrap",
              selectedCountry === country 
                ? "bg-vpn-blue text-white" 
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            onClick={() => onCountryChange(country === selectedCountry ? null : country)}
          >
            {country}
          </button>
        ))}
      </div>
      
      {/* Advanced filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Favorites toggle */}
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            className={cn(
              "flex items-center gap-1",
              showFavoritesOnly && "bg-vpn-blue hover:bg-vpn-blue/90"
            )}
            onClick={() => onShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className="w-4 h-4" fill={showFavoritesOnly ? "currentColor" : "none"} />
            <span>Favorites</span>
          </Button>
          
          {/* Advanced filters popover */}
          <Popover open={isAdvancedFiltersOpen} onOpenChange={setIsAdvancedFiltersOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={hasActiveFilters ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex items-center gap-1",
                  hasActiveFilters && "bg-vpn-blue hover:bg-vpn-blue/90"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <Badge className="ml-1 bg-white text-vpn-blue">
                    {[
                      selectedCountry !== null ? 1 : 0,
                      loadFilter !== 'all' ? 1 : 0,
                      pingFilter !== 'all' ? 1 : 0,
                      sortBy !== 'recommended' ? 1 : 0,
                      showFavoritesOnly ? 1 : 0
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Advanced Filters</h3>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleResetFilters}
                      className="h-8 text-xs flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Reset filters
                    </Button>
                  )}
                </div>
                
                {/* Server load filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Server Load</h4>
                  <RadioGroup 
                    value={loadFilter} 
                    onValueChange={(v) => onLoadFilterChange(v as LoadFilter)}
                    className="flex flex-wrap gap-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="all" id="load-all" />
                      <Label htmlFor="load-all">All</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="low" id="load-low" />
                      <Label htmlFor="load-low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="medium" id="load-medium" />
                      <Label htmlFor="load-medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="high" id="load-high" />
                      <Label htmlFor="load-high">High</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Ping filter */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Ping</h4>
                  <RadioGroup 
                    value={pingFilter} 
                    onValueChange={(v) => onPingFilterChange(v as PingFilter)}
                    className="flex flex-wrap gap-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="all" id="ping-all" />
                      <Label htmlFor="ping-all">All</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="excellent" id="ping-excellent" />
                      <Label htmlFor="ping-excellent">Excellent (&lt;50ms)</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="good" id="ping-good" />
                      <Label htmlFor="ping-good">Good (&lt;100ms)</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="fair" id="ping-fair" />
                      <Label htmlFor="ping-fair">Fair (any)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Sort options */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Sort By</h4>
                  <RadioGroup 
                    value={sortBy} 
                    onValueChange={(v) => onSortChange(v as ServerSort)}
                    className="flex flex-wrap gap-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="recommended" id="sort-recommended" />
                      <Label htmlFor="sort-recommended">Recommended</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="name" id="sort-name" />
                      <Label htmlFor="sort-name">Name</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="ping" id="sort-ping" />
                      <Label htmlFor="sort-ping">Ping (lowest)</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="load" id="sort-load" />
                      <Label htmlFor="sort-load">Load (lowest)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1 text-xs">
            {selectedCountry && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => onCountryChange(null)}
              >
                {selectedCountry}
                <X className="w-3 h-3 ml-1 cursor-pointer" />
              </Badge>
            )}
            
            {loadFilter !== 'all' && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => onLoadFilterChange('all')}
              >
                Load: {loadFilter}
                <X className="w-3 h-3 ml-1 cursor-pointer" />
              </Badge>
            )}
            
            {pingFilter !== 'all' && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => onPingFilterChange('all')}
              >
                Ping: {pingFilter}
                <X className="w-3 h-3 ml-1 cursor-pointer" />
              </Badge>
            )}
            
            {sortBy !== 'recommended' && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => onSortChange('recommended')}
              >
                Sort: {sortBy}
                <X className="w-3 h-3 ml-1 cursor-pointer" />
              </Badge>
            )}
            
            {showFavoritesOnly && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => onShowFavoritesOnly(false)}
              >
                Favorites only
                <X className="w-3 h-3 ml-1 cursor-pointer" />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
