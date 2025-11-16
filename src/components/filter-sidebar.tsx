"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const categories = ['Clothes', 'Gadgets', 'Books', 'Furniture', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair'];

interface FilterSidebarProps {
    filters: {
        category: string;
        price: number;
        conditions: string[];
    };
    onFilterChange: (newFilters: Partial<FilterSidebarProps['filters']>) => void;
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  
  const handleConditionChange = (condition: string, checked: boolean) => {
    const newConditions = checked
      ? [...filters.conditions, condition]
      : filters.conditions.filter((c) => c !== condition);
    onFilterChange({ conditions: newConditions });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter & Sort</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange({ category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <Slider 
            value={[filters.price]} 
            onValueChange={(value) => onFilterChange({ price: value[0] })}
            max={500} 
            step={10} 
           />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>RM0</span>
            <span>RM{filters.price}{filters.price === 500 ? '+' : ''}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Condition</Label>
          <div className="space-y-2">
            {conditions.map((condition) => {
                const conditionId = condition.toLowerCase().replace(' ', '');
                return (
                  <div key={conditionId} className="flex items-center space-x-2">
                    <Checkbox
                      id={conditionId}
                      checked={filters.conditions.includes(conditionId)}
                      onCheckedChange={(checked) => handleConditionChange(conditionId, !!checked)}
                    />
                    <label
                      htmlFor={conditionId}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition}
                    </label>
                  </div>
                )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
