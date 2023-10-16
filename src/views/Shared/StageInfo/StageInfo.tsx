import React, { useEffect, useRef, useState } from "react";
import "./StageInfo.scss";
import { Row, Col, Card } from "react-bootstrap";
import { JokeModel, StageInfoModel, Suburb } from "../../../interfaces/userDetails";
import SaLoadsheddingService from "../../../service/sa-loadshedding.service";
import JokesService from "../../../service/jokes.service";

export interface StageInfoProps {
  suburb: Suburb;
  stage: number;
  onIsBusyChanged?: (data: any) => void;
  days?: number;
}
function StageInfo({
  suburb,
  stage,
  onIsBusyChanged: isBusyProcessing,
  days,
}: StageInfoProps) {
  console.log("Getting stage Data " + stage);
  const saLoadsheddingService = SaLoadsheddingService.getInstance();
  const jokesService = JokesService.getInstance();
  const [scheduleData, setScheduleData] = useState<StageInfoModel[]>();
  const [loading, setLoading] = useState({});
  const [joke, setJoke] = useState<JokeModel>({} as JokeModel);

  var doneYet = useRef(true);
  var timerId: any;

  const checkBack = () =>
    timerId = setTimeout(function () {
      clearTimeout(timerId);
      if (doneYet.current === false) {
        setLoading({
          isLoading: true,
          message: "The server is taking its time...",
        });
        checkBack();
      } else {
        setLoading({ isLoading: false, message: "DONE!" });
      }
    }, 4000);

  useEffect(() => {
    clearTimeout(timerId);
    if (doneYet.current === true) {
      isBusyProcessing!({ isLoading: false, message: "DONE" });
    } else {
      checkBack();
    }
  }, [doneYet.current]);

  useEffect(() => {
    isBusyProcessing!(loading);
  }, [loading]);

  useEffect(() => {
    doneYet.current = false;
    const getDataRes = async () => {
      try {
        var res = await saLoadsheddingService.getSchedule(
          suburb.blockId,
          stage,
          !days ? 5 : days,
          suburb.municipalityId
        );
        setScheduleData(res);
        doneYet.current = true;
      } catch (err) {
        const error = err as any;
        setLoading({
          isLoading: false,
          message: `ERROR : ${error.message.toString()}`,
        });
      } finally {
        if (stage <1) {
          await GetJoke();
        }
      }
    };
    getDataRes();
  }, []);

  var hasNextTime = false;
  const getClass = (dt: Date, slotStart: Date) => {
    if (
      hasNextTime === false &&
      ((dt.getDate() === new Date().getDate() &&
        slotStart.getHours() >= new Date().getHours()) ||
        dt.getDate() > new Date().getDate())
    ) {
      hasNextTime = true;
      return "bg-warning";
    }
    return "";
  };
  const getInfo = (arr: StageInfoModel[], idx: number, stage: number) => {
    var i = idx;
    var data = "";
    while (arr[i]?.dayOfMonth === arr[idx]?.dayOfMonth) {
      if (arr[i]?.stage <= stage) {
        var hoursValue = +arr[i].start.substring(0, 2);
        data += `
        <Row class='${getClass(
          new Date(arr[i].dayOfMonth),
          new Date(new Date().setHours(hoursValue))
        )}'>
          <Col>
            ${arr[i].start} - ${arr[i].end}<sub>${arr[i].stage}</sub>
          </Col>
        </Row>
        `;
      }
      i++;
    }
    return <div dangerouslySetInnerHTML={{ __html: data }} />;
  };

  const GetJoke = async () => {
    var res = await jokesService.getJoke()
    setJoke(res);
  }

  return (
    <>
      <div>
        {scheduleData && scheduleData.length === 0 ? <Col>
          <Card>
            <Card.Header>
              {"No Loadshedding"}
            </Card.Header>
            <Card.Body>
              <Card.Text><p>{joke.joke}</p><p>{joke.answer}</p></Card.Text>
            </Card.Body>
          </Card>
        </Col> :
          <Row xs={2} md={2} className="g-4">
            {
              scheduleData?.map((x, idx, arr) => {
                if (
                  idx === 0 ||
                  (idx > 0 && arr[idx - 1].dayOfMonth !== x.dayOfMonth)
                ) {
                  return (
                    <Col>
                      <Card>
                        <Card.Header>
                          {x.dayOfMonth.toString().substring(0, 10)}
                        </Card.Header>
                        <Card.Body>
                          <Card.Text>{getInfo(arr, idx, stage)}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                } else {
                  return "";
                }
              })}
          </Row>
        }
      </div>
    </>
  );
}

export default StageInfo;
