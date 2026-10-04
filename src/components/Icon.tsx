import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const Icon = MaterialCommunityIcons;
export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];