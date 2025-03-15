import { IconChevronDown, IconChevronsDown, IconClock } from "@tabler/icons-react";

const getBlip = (v: number, k: number) => {
  switch (v) {
    case 1:
      return <IconChevronDown key={k} size={15} />;
    case 2:
      return <IconChevronsDown key={k} size={15} />;
    case 3:
      return <IconClock key={k} size={15} />;
  }
};

export { getBlip };
