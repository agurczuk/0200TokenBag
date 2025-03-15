import { Button, Card, Group, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronsDown,
  IconClock,
} from "@tabler/icons-react";

type StartPageProps = {
  bags: {
    defenders: number[];
    attackers: number[];
    reinforcements: number[];
  };
  actions: {
    addToken: (bagtype: string, val: number) => void;
    removeToken: (bagtype: string, val: number) => void;
    startGame: () => void;
  };
};

const StartPage = (props: StartPageProps) => {
  const getChev = (type: string, val: number, key: number) => {
    const col =
      type === "attacker" ? "blue" : type === "defenders" ? "red" : "green";
    return (
      <Button
        bg={col}
        key={key}
        size="compact-sm"
        onClick={() => props.actions.removeToken(type, key)}
      >
        {getIcon(val)}
      </Button>
    );
  };

  const getIcon = (val: number) => {
    switch (val) {
      case 1:
        return <IconChevronDown />;
      case 2:
        return <IconChevronsDown />;
      default:
        return <IconClock />;
    }
  };

  return (
    <Card shadow="xl" padding="md" withBorder>
      <Text fw={700} td="underline">
        Prepare units
      </Text>
      <Card.Section>
        <Text c="red">Defenders</Text>
        <Group m="0" gap={1} mih={60} align="center" w="100%" justify="center">
          {props.bags.defenders.map((v, k) => {
            return getChev("defenders", v, k);
          })}
        </Group>
      </Card.Section>
      <Card.Section>
        <Text c="blue">Attackers</Text>
        <Group m="0" gap={1} mih={60} align="center" w="100%" justify="center">
          {props.bags.attackers.map((v, k) => {
            return getChev("attacker", v, k);
          })}
        </Group>
      </Card.Section>
      <Card.Section>
        <Text c="teal">Reinforcements</Text>
        <Group m="0" gap={1} mih={60} align="center" w="100%" justify="center">
          {props.bags.reinforcements.map((v, k) => {
            return getChev("reinforcement", v, k);
          })}
        </Group>
      </Card.Section>
      <Card.Section>
        <Text c="white">Utilities</Text>
        <Group align="center" m={10} justify="center">
          <IconClock />
          <IconClock />
          <IconClock />
        </Group>
      </Card.Section>
      <Card.Section m="sm">
        <Button size="xl" fullWidth onClick={() => props.actions.startGame()}>
          Start
        </Button>
      </Card.Section>
      <Group align="center" m={2} justify="center">
        <Button
          bg="red"
          size="md"
          onClick={() => props.actions.addToken("defenders", 1)}
        >
          <IconChevronDown size={40} />
        </Button>
        <Button
          bg="red"
          size="md"
          onClick={() => props.actions.addToken("defenders", 2)}
        >
          <IconChevronsDown size={40} />
        </Button>
      </Group>
      <Group align="center" m={2} justify="center">
        <Button
          bg="blue"
          size="md"
          onClick={() => props.actions.addToken("attacker", 1)}
        >
          <IconChevronDown size={40} />
        </Button>
        <Button
          bg="blue"
          size="md"
          onClick={() => props.actions.addToken("attacker", 2)}
        >
          <IconChevronsDown size={40} />
        </Button>
      </Group>
      <Group align="center" m={2} justify="center">
        <Button
          bg="green"
          size="md"
          onClick={() => props.actions.addToken("reinforcement", 1)}
        >
          <IconChevronDown size={40} />
        </Button>
        <Button
          bg="green"
          size="md"
          onClick={() => props.actions.addToken("reinforcement", 2)}
        >
          <IconChevronsDown size={40} />
        </Button>
      </Group>
    </Card>
  );
};
export default StartPage;
