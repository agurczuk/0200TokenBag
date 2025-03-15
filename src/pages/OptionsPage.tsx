import { Button, Card, Group } from "@mantine/core";
import { pageEnum } from "../Enums";
import { getBlip } from "../Shared";
import { IconChevronDown, IconChevronsDown } from "@tabler/icons-react";

type OptionsPageProps = {
  bags: {
    bagPool: number[];
    bag: number[];
    drawn: number[];
    reinforcements: number[];
  };
  actions: {
    setPage: (page: pageEnum) => void;
    kill: (v: number) => void;
    addUnit: (v: number) => void;
    addReinforcements: () => void;
    pullUnit: (v: number) => void;
    pushUnit: (v: number) => void;
  };
};

const OptionsPage = (props: OptionsPageProps) => {
  return (
    <Card>
      <Group>
        <Button
          fullWidth
          h={40}
          size="lg"
          onClick={() => props.actions.setPage(pageEnum.Game)}
        >
          Back
        </Button>
      </Group>
      <Group gap="xs" mih={40} m={5}>
        Pool:
        {props.bags.bagPool.map((val, key) => {
          return getBlip(val, key);
        })}
      </Group>
      <Group gap="xs" mih={40} m={5}>
        Bag:
        {props.bags.bag.map((val, key) => {
          return getBlip(val, key);
        })}
      </Group>
      <Group gap="xs" mih={40} m={5}>
        Drawn:
        {props.bags.drawn.map((val, key) => {
          return getBlip(val, key);
        })}
      </Group>
      <Group gap={2}>
        <Button
          size="l"
          h={50}
          p={0}
          w="49%"
          bg="red"
          onClick={() => props.actions.kill(1)}
          rightSection={<IconChevronDown />}
        >
          Kill Trooper
        </Button>
        <Button
          p={0}
          h={50}
          w="49%"
          size="l"
          bg="red"
          onClick={() => props.actions.kill(2)}
          rightSection={
            <>
              <IconChevronsDown />
              <IconChevronsDown />
            </>
          }
        >
          Kill Character
        </Button>
        <Group gap="xs" mih={40} m={5}>
          Reinforcements:
          {props.bags.reinforcements.map((val, key) => {
            return getBlip(val, key);
          })}
        </Group>
        <Button
          fullWidth
          h={40}
          size="xl"
          bg="green"
          onClick={() => props.actions.addReinforcements()}
        >
          Add reinforcements
        </Button>
        <Group w="100%" mt={10} gap={2}>
          <Button
            p={0}
            h={50}
            w="49%"
            size="l"
            bg="yellow"
            onClick={() => props.actions.addUnit(1)}
          >
            Add Trooper
          </Button>
          <Button
            p={0}
            h={50}
            w="49%"
            size="l"
            bg="yellow"
            onClick={() => props.actions.addUnit(2)}
          >
            Add Character
          </Button>
        </Group>
        <Group mt={20} gap={2}>
          <Button
            w="49%"
            h={40}
            size="l"
            bg="cyan"
            onClick={() => props.actions.pullUnit(1)}
          >
            Pull Trooper
          </Button>
          <Button
            h={40}
            w="49%"
            size="l"
            bg="cyan"
            onClick={() => props.actions.pullUnit(2)}
          >
            Pull Character
          </Button>
          <Button
            h={40}
            size="l"
            w="49%"
            bg="cyan"
            onClick={() => props.actions.pushUnit(1)}
          >
            Put Back Trooper
          </Button>
          <Button
            h={40}
            size="l"
            w="49%"
            bg="cyan"
            onClick={() => props.actions.pushUnit(2)}
          >
            Put back Character
          </Button>
        </Group>
      </Group>
    </Card>
  );
};

export default OptionsPage;
