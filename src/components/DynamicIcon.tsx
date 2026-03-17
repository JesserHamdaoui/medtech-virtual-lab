import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBars,
  faBook,
  faBolt,
  faCalendar,
  faCalculator,
  faChartLine,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleInfo,
  faCircleQuestion,
  faCircleXmark,
  faClock,
  faEllipsisVertical,
  faEnvelope,
  faEye,
  faFileLines,
  faFilter,
  faFlask,
  faFlaskVial,
  faFloppyDisk,
  faGauge,
  faGlobe,
  faGraduationCap,
  faHouse,
  faLock,
  faMagnifyingGlass,
  faMusic,
  faPenToSquare,
  faPhone,
  faPlus,
  faRightFromBracket,
  faRightToBracket,
  faSpinner,
  faStar,
  faTag,
  faTrashCan,
  faTriangleExclamation,
  faTrophy,
  faUpRightFromSquare,
  faUser,
  faUserShield,
  faUsers,
  faWrench,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { IconProps, getIconSize } from "../lib/icons";

// Icon mapping for string-based icon names
const iconMap: Record<string, IconDefinition> = {
  Lightning: faBolt,
  Music: faMusic,
  Lightbulb: faCircleInfo,
  Light: faCircleInfo,
  View: faEye,
  Physics: faBolt,
  Chemistry: faFlask,
  Biology: faFlask,
  Mathematics: faCalculator,
  Engineering: faWrench,
  Science: faFlaskVial,
  Lab: faFlaskVial,
  Microscope: faEye,
  Beaker: faFlask,
  Calculator: faCalculator,
  Globe: faGlobe,
  Book: faBook,
  Document: faFileLines,
  Education: faGraduationCap,
  Dashboard: faGauge,
  Settings: faWrench,
  User: faUser,
  UserMultiple: faUsers,
  UserAdmin: faUserShield,
  Home: faHouse,
  Information: faCircleInfo,
  Info: faCircleInfo,
  Email: faEnvelope,
  Phone: faPhone,
  Login: faRightToBracket,
  Logout: faRightFromBracket,
  Search: faMagnifyingGlass,
  Filter: faFilter,
  ArrowRight: faArrowRight,
  ArrowLeft: faArrowLeft,
  Warning: faTriangleExclamation,
  WarningAlt: faTriangleExclamation,
  CheckmarkFilled: faCircleCheck,
  CheckCircle: faCircleCheck,
  ErrorFilled: faCircleXmark,
  Time: faClock,
  ChartLine: faChartLine,
  Task: faCircleCheck,
  Trophy: faTrophy,
  Research: faFlaskVial,
  Save: faFloppyDisk,
  Edit: faPenToSquare,
  Loading: faSpinner,
  InProgress: faSpinner,
  Star: faStar,
  Lock: faLock,
  Add: faPlus,
  TrashCan: faTrashCan,
  Calendar: faCalendar,
  Tag: faTag,
  Help: faCircleQuestion,
  Launch: faUpRightFromSquare,
  OverflowMenuVertical: faEllipsisVertical,
  ChevronDown: faChevronDown,
  ChevronUp: faChevronUp,
  Menu: faBars,
  Close: faXmark,
  LogoFacebook: faFacebook,
  LogoTwitter: faTwitter,
  LogoLinkedin: faLinkedin,
  Profile: faUser,
};

interface DynamicIconProps extends IconProps {
  name: string;
}

export default function DynamicIcon({
  name,
  size = "md",
  className = "",
}: DynamicIconProps) {
  const iconDefinition = iconMap[name] || faCircleInfo;
  const iconSize = getIconSize(size);
  const shouldSpin = name === "Loading" || name === "InProgress";

  return (
    <FontAwesomeIcon
      icon={iconDefinition}
      className={className}
      spin={shouldSpin}
      style={{ fontSize: `${iconSize}px` }}
    />
  );
}
