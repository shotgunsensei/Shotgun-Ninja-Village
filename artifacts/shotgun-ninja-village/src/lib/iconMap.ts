import type { LucideIcon } from "lucide-react";
import {
  Megaphone, DoorOpen, BookOpen, Wrench, Hammer, Shirt, MessageCircle,
  Crown, Award, Lock, Zap, Bell, Shield, User, Play, Tag,
} from "lucide-react";

export const sharedIconMap: Record<string, LucideIcon> = {
  megaphone: Megaphone,
  "door-open": DoorOpen,
  "book-open": BookOpen,
  wrench: Wrench,
  hammer: Hammer,
  shirt: Shirt,
  "message-circle": MessageCircle,
  crown: Crown,
  award: Award,
  lock: Lock,
  zap: Zap,
  bell: Bell,
  shield: Shield,
  user: User,
  play: Play,
  tag: Tag,
};

export function resolveIcon(name: string, fallback: LucideIcon): LucideIcon {
  return sharedIconMap[name] ?? fallback;
}
