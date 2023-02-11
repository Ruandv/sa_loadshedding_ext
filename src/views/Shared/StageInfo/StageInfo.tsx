import React, { useEffect, useRef, useState } from "react";
import "./StageInfo.scss";
import { Row, Col, Card } from "react-bootstrap";
import { StageInfoModel, Suburb } from "../../../interfaces/userDetails";
import RuanService from "../../../service/ruan.service";

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
  const ruanService = RuanService.getInstance();
  const [scheduleData, setScheduleData] = useState<StageInfoModel[]>();
  const [loading, setLoading] = useState({});
  var doneYet = useRef(true);

  const checkBack = () =>
    setTimeout(function () {
      if (doneYet.current === false) {
        setLoading({
          isLoading: true,
          message: "The server is taking its time...",
        });
        checkBack();
      } else {
        setLoading({ isLoading: false, message: "DONE!" });
      }
    }, 2000);

  useEffect(() => {
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
        var res = await ruanService.getSchedule(
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

  return (
    <>
      <div>
        <Row xs={2} md={2} className="g-4">
          {scheduleData?.map((x, idx, arr) => {
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
      </div>
    </>
  );
}

export default StageInfo;
