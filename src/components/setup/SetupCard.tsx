import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Download, 
  Share2, 
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Setup } from '@/stores/useSetupStore';

interface SetupCardProps {
  setup: Setup;
  onView: (setup: Setup) => void;
  onShare: (setup: Setup) => void;
  onDelete: (setup: Setup) => void;
  isOwner: boolean;
}

const SetupCard: React.FC<SetupCardProps> = ({
  setup,
  onView,
  onShare,
  onDelete,
  isOwner
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{setup.title}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(setup.created_at), 'MMM d, yyyy')}
            </p>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onShare(setup)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-500"
                  onClick={() => onDelete(setup)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge>{setup.car_model}</Badge>
          <Badge variant="outline">{setup.track_name}</Badge>
          <Badge variant="outline">{setup.sim_platform}</Badge>
        </div>
        {setup.description && (
          <p className="text-sm line-clamp-2">{setup.description}</p>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <span className="text-xs">Owner</span>
        </div>
        <Button size="sm" variant="outline" onClick={() => onView(setup)}>
          <FileText className="h-4 w-4 mr-1" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SetupCard;
