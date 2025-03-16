import { Button, Card, Group, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronsDown,
  IconClock,
  IconFlagCheck,
  IconQuestionMark,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import StartPage from "./pages/StartPage";
import OptionsPage from "./pages/OptionsPage";
import { pageEnum } from "./Enums";
import { getBlip } from "./Shared";

export type utype = "defenders" | "attacker" | "reinforcement";

interface GameState {
  attackers: number[];
  defenders: number[];
  reinforcements: number[];
  bag: number[];
  bagPool: number[];
  drawn: number[];
  page: pageEnum;
  token: number | undefined;
  timeTokens: number;
  nextTurnReady: boolean;
  turnNo: number;
  reinfAdded: boolean;
}

const random = (l: number) => {
  return Math.floor(Math.random() * l);
};

//on load
const savedState = localStorage.getItem("startstate");
const startState: GameState | undefined = savedState
  ? JSON.parse(savedState)
  : undefined;

function App() {
  const [defenders, setDefenders] = useState<number[]>(
    startState?.defenders ?? []
  );
  const [attackers, setAttackers] = useState<number[]>(
    startState?.attackers ?? []
  );
  const [reinforcements, setReinforcements] = useState<number[]>(
    startState?.reinforcements ?? []
  );
  const [bag, setBag] = useState<number[]>(startState?.bag ?? []);
  const [bagPool, setBagPool] = useState<number[]>(startState?.bagPool ?? []);
  const [drawn, setDrawn] = useState<number[]>(startState?.drawn ?? []);

  const [page, setPage] = useState<pageEnum>(
    startState?.page ?? pageEnum.Start
  );

  const [token, setToken] = useState<number | undefined>(
    startState?.token ?? undefined
  );
  const [timeTokens, setTimeTokens] = useState<number>(
    startState?.timeTokens ?? 0
  );
  const [nextTurnReady, setNextTurnReady] = useState<boolean>(
    startState?.nextTurnReady ?? false
  );
  const [turnNo, setTurnNo] = useState<number>(startState?.turnNo ?? 0);

  const [reinfAdded, setReinfAdded] = useState<boolean>(
    startState?.reinfAdded ?? false
  );

  const [drawEnabled, setDrawEnabled] = useState<boolean>(true);

  //localstorage
  useEffect(() => {
    const saveblob: GameState = {
      attackers: attackers,
      defenders: defenders,
      reinforcements: reinforcements,
      bag: bag,
      bagPool: bagPool,
      drawn: drawn,
      page: page,
      token: token,
      timeTokens: timeTokens,
      nextTurnReady: nextTurnReady,
      reinfAdded: reinfAdded,
      turnNo: turnNo,
    };
    localStorage.setItem("startstate", JSON.stringify(saveblob));
  }, [
    attackers,
    defenders,
    reinforcements,
    bag,
    bagPool,
    drawn,
    page,
    token,
    timeTokens,
    nextTurnReady,
    reinfAdded,
    turnNo,
  ]);

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

    setDrawEnabled(false);
    setTimeout(() => {
      setDrawEnabled(true);
    }, 1000);
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

  const addToken = (type: string, val: number) => {
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

  const removeToken = (type: string, key: number) => {
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

        if (iix > -1) {
          bagPool.splice(iix, 1);
        }

        let iiix = bagPool.indexOf(2, iix);
        if (iiix > -1) {
          bagPool.splice(iiix, 1);
        }

        setBagPool([...bagPool]);

        break;
    }
  };

  return (
    <>
      {page === pageEnum.Options && (
        <OptionsPage
          bags={{
            bag: bag,
            bagPool: bagPool,
            drawn: drawn,
            reinforcements: reinforcements,
          }}
          actions={{
            addReinforcements: addReinforcements,
            addUnit: addUnit,
            kill: kill,
            pullUnit: pullUnit,
            pushUnit: pushUnit,
            setPage: setPage,
          }}
        />
      )}
      {page === pageEnum.EndGame && (
        <Card>
          <Group justify="center" pt={50} pb={50}>
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
          <Card.Section p={20} withBorder m={10}>
            <Group justify="center">{getDrawnToken()}</Group>
          </Card.Section>
          <Group mih={80} gap="xs">
            {drawn.map((val, key) => {
              return getBlip(val, key);
            })}
          </Group>
          <Card.Section m={10}>
            {!nextTurnReady && (
              <Button
                disabled={!drawEnabled}
                fullWidth
                h={100}
                size="xl"
                onClick={() => drawToken()}
              >
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
              w="45%"
              size="xl"
              onClick={() => {
                setPage(pageEnum.Options);
              }}
            >
              Options
            </Button>
            <Button
              size="xl"
              w="45%"
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
        <StartPage
          bags={{
            attackers: attackers,
            defenders: defenders,
            reinforcements: reinforcements,
          }}
          actions={{
            addToken: addToken,
            removeToken: removeToken,
            startGame: startGame,
          }}
        />
      )}
    </>
  );
}

export default App;
