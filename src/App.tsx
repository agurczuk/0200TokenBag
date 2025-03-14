import { Button, Card, Group, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronsDown,
  IconClock,
  IconFlagCheck,
  IconQuestionMark,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export type utype = "defenders" | "attacker" | "reinforcement";

enum pageEnum {
  Start,
  Game,
  Options,
  EndGame,
}

const random = (l: number) => {
  return Math.floor(Math.random() * l);
};

function App() {
  const [defenders, setDefenders] = useState<number[]>([]);
  const [attackers, setAttackers] = useState<number[]>([]);
  const [reinforcements, setReinforcements] = useState<number[]>([]);
  const [bag, setBag] = useState<number[]>([]);
  const [bagPool, setBagPool] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);

  const [page, setPage] = useState<pageEnum>(pageEnum.Start);

  const [token, setToken] = useState<number>();
  const [timeTokens, setTimeTokens] = useState<number>(0);
  const [nextTurnReady, setNextTurnReady] = useState<boolean>(false);
  const [turnNo, setTurnNo] = useState<number>(0);

  const [reinfAdded, setReinfAdded] = useState<boolean>(false);

  const startGame = () => {
    setBag([...attackers, ...defenders, 3, 3, 3]);
    setBagPool([...attackers, ...defenders]);
    setPage(pageEnum.Game);
    setToken(undefined);
    setTimeTokens(0);
    setTurnNo(1);
    setDrawn([]);
    setReinfAdded(false);
  };

  const endGame = () => {
    setPage(pageEnum.Start);
  };

  const getDrawnToken = () => {
    const iconSize = 150;

    if (nextTurnReady) {
      return <IconFlagCheck size={iconSize} color="red" />;
    }

    switch (token) {
      case 1:
        return <IconChevronDown size={iconSize} />;
      case 2:
        return <IconChevronsDown size={iconSize} />;
      case 3:
        return <IconClock size={iconSize} />;
    }

    return <IconQuestionMark size={iconSize} />;
  };

  const drawToken = () => {
    const ix = random(bag.length);
    if (bag[ix] === 3) {
      setTimeTokens(timeTokens + 1);
    }
    setToken(bag[ix]);
    setDrawn([...drawn, bag[ix]]);
    bag.splice(ix, 1);
    setBag([...bag]);
  };

  const nextTurn = () => {
    setNextTurnReady(false);
    setTurnNo(turnNo + 1);
    setTimeTokens(0);
    setBag([3, 3, 3, ...bagPool]);
    setDrawn([]);
  };

  useEffect(() => {
    if (timeTokens === 3) {
      setNextTurnReady(true);
    }
  }, [timeTokens]);

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

  const addToken = (type: utype, val: number) => {
    switch (type) {
      case "attacker":
        setAttackers([...attackers, val]);
        break;
      case "defenders":
        setDefenders([...defenders, val]);
        break;
      case "reinforcement":
        setReinforcements([...reinforcements, val]);
        break;
    }
  };

  const removeToken = (type: utype, key: number) => {
    switch (type) {
      case "attacker":
        attackers.splice(key, 1);
        setAttackers([...attackers]);
        break;
      case "defenders":
        defenders.splice(key, 1);
        setDefenders([...defenders]);
        break;
      case "reinforcement":
        reinforcements.splice(key, 1);
        setReinforcements([...reinforcements]);
        break;
    }
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

  const getChev = (type: utype, val: number, key: number) => {
    const col =
      type === "attacker" ? "blue" : type === "defenders" ? "red" : "green";
    return (
      <Button
        bg={col}
        key={key}
        size="compact-sm"
        onClick={() => removeToken(type, key)}
      >
        {getIcon(val)}
      </Button>
    );
  };

  const addReinforcements = () => {
    if (!reinfAdded) {
      setBagPool([...reinforcements, ...bagPool]);
      setBag([...bag, ...reinforcements]);
      setPage(pageEnum.Game);
      setReinfAdded(true);
    }
  };

  const addUnit = (type: number) => {
    setBagPool([...bagPool, type]);
    setBag([...bag, type]);
  };

  const pullUnit = (type: number) => {
    //find first token of type
    const ix = bag.indexOf(type);
    if (ix > -1) {
      setBag((arr) => arr.filter((_, i) => i !== ix));
      setDrawn((arr) => [...arr, type]);
    }
  };

  const pushUnit = (type: number) => {
    const ix = drawn.indexOf(type);
    if (ix > -1) {
      setDrawn((arr) => arr.filter((_, i) => i !== ix));
      setBag((arr) => [...arr, type]);
    }
  };

  const kill = (type: number) => {
    switch (type) {
      case 1:
        const ix = bagPool.indexOf(1);
        if (ix > -1) {
          bagPool.splice(ix, 1);
          setBagPool([...bagPool]);
        }
        break;
      case 2:
        let iix = bagPool.indexOf(2);
        let iiix = bagPool.indexOf(2, iix + 1);

        if (iix > -1) {
          bagPool.splice(iix, 1);
        }
        if (iiix) {
          bagPool.splice(iiix, 1);
        }

        setBagPool([...bagPool]);

        break;
    }
  };

  return (
    <>
      {page === pageEnum.Options && (
        <Card>
          <Group>
            <Button
              fullWidth
              h={40}
              size="lg"
              onClick={() => setPage(pageEnum.Game)}
            >
              Back
            </Button>
          </Group>
          <Group gap="xs" mih={40} m={5}>
            Pool:
            {bagPool.map((val, key) => {
              return getBlip(val, key);
            })}
          </Group>
          <Group gap="xs" mih={40} m={5}>
            Bag:
            {bag.map((val, key) => {
              return getBlip(val, key);
            })}
          </Group>
          <Group gap="xs" mih={40} m={5}>
            Drawn:
            {drawn.map((val, key) => {
              return getBlip(val, key);
            })}
          </Group>
          <Group>
            <Button
              fullWidth
              h={40}
              size="xl"
              bg="red"
              onClick={() => kill(1)}
              rightSection={<IconChevronDown />}
            >
              Kill Trooper
            </Button>
            <Button
              fullWidth
              h={40}
              size="xl"
              bg="red"
              onClick={() => kill(2)}
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
              {reinforcements.map((val, key) => {
                return getBlip(val, key);
              })}
            </Group>
            <Button
              fullWidth
              h={40}
              size="xl"
              bg="green"
              mt={0}
              onClick={() => addReinforcements()}
            >
              Add reinforcements
            </Button>
            <Button
              fullWidth
              h={40}
              size="xl"
              bg="yellow"
              mt={40}
              onClick={() => addUnit(1)}
            >
              Add Trooper
            </Button>
            <Button
              fullWidth
              h={40}
              size="xl"
              bg="yellow"
              onClick={() => addUnit(2)}
            >
              Add Character
            </Button>
            <Button
              fullWidth
              h={40}
              size="xl"
              mt={40}
              bg="cyan"
              onClick={() => pullUnit(1)}
            >
              Pull Trooper
            </Button>
            <Button
              fullWidth
              h={40}
              size="xl"
              bg="cyan"
              onClick={() => pullUnit(2)}
            >
              Pull Character
            </Button>
            <Button
              fullWidth
              h={40}
              size="xl"
              bg="cyan"
              onClick={() => pushUnit(1)}
            >
              Put Back Trooper
            </Button>
            <Button
              fullWidth
              h={40}
              size="xl"
              bg="cyan"
              onClick={() => pushUnit(2)}
            >
              Put back Character
            </Button>
          </Group>
        </Card>
      )}
      {page === pageEnum.EndGame && (
        <Card>
          <Group>
            <Button
              h={100}
              size="xl"
              onClick={() => endGame()}
              variant="filled"
              bg="red"
            >
              End Game
            </Button>
            <Button h={100} size="xl" onClick={() => setPage(pageEnum.Game)}>
              Cancel
            </Button>
          </Group>
        </Card>
      )}
      {page === pageEnum.Game && (
        <Card>
          <Group mih={80} gap="xs">
            {bag.map((val, key) => {
              return getBlip(val, key);
            })}
          </Group>
          <Text>Turn {turnNo}</Text>
          <Card.Section p={100} withBorder m={10}>
            {getDrawnToken()}
          </Card.Section>
          <Group mih={80} gap="xs">
            {drawn.map((val, key) => {
              return getBlip(val, key);
            })}
          </Group>
          <Card.Section m={10}>
            {!nextTurnReady && (
              <Button fullWidth h={100} size="xl" onClick={() => drawToken()}>
                Draw
              </Button>
            )}
            {nextTurnReady && (
              <Button fullWidth h={100} size="xl" onClick={() => nextTurn()}>
                Next Turn
              </Button>
            )}
          </Card.Section>
          <Group justify="center">
            <Button
              onClick={() => {
                setPage(pageEnum.Options);
              }}
            >
              Options
            </Button>
            <Button
              onClick={() => {
                setPage(pageEnum.EndGame);
              }}
            >
              End game
            </Button>
          </Group>
        </Card>
      )}
      {page === pageEnum.Start && (
        <Card shadow="xl" padding="md" withBorder>
          <Text fw={700} td="underline">
            Prepare units
          </Text>
          <Card.Section>
            <Text c="red">Defenders</Text>
            <Group m="0" mih={100} align="center" w="100%" justify="center">
              {defenders.map((v, k) => {
                return getChev("defenders", v, k);
              })}
            </Group>
          </Card.Section>
          <Card.Section>
            <Text c="blue">Attackers</Text>
            <Group m="0" mih={100} align="center" w="100%" justify="center">
              {attackers.map((v, k) => {
                return getChev("attacker", v, k);
              })}
            </Group>
          </Card.Section>
          <Card.Section>
            <Text c="teal">Reinforcements</Text>
            <Group m="0" mih={100} align="center" w="100%" justify="center">
              {reinforcements.map((v, k) => {
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
            <Button size="xl" fullWidth onClick={() => startGame()}>
              Start
            </Button>
          </Card.Section>
          <Group align="center" m="sm" justify="center">
            <Button bg="red" size="lg" onClick={() => addToken("defenders", 1)}>
              <IconChevronDown size={40} />
            </Button>
            <Button bg="red" size="lg" onClick={() => addToken("defenders", 2)}>
              <IconChevronsDown size={40} />
            </Button>
          </Group>
          <Group align="center" m="sm" justify="center">
            <Button bg="blue" size="lg" onClick={() => addToken("attacker", 1)}>
              <IconChevronDown size={40} />
            </Button>
            <Button bg="blue" size="lg" onClick={() => addToken("attacker", 2)}>
              <IconChevronsDown size={40} />
            </Button>
          </Group>
          <Group align="center" m="sm" justify="center">
            <Button
              bg="green"
              size="lg"
              onClick={() => addToken("reinforcement", 1)}
            >
              <IconChevronDown size={40} />
            </Button>
            <Button
              bg="green"
              size="lg"
              onClick={() => addToken("reinforcement", 2)}
            >
              <IconChevronsDown size={40} />
            </Button>
          </Group>
        </Card>
      )}
    </>
  );
}

export default App;
