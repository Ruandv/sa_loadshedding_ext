import React, { useEffect, useState } from "react";
import "./StageInfo.scss";
import { Row, Col, Card } from "react-bootstrap";
import { StageInfoModel, Suburb } from "../../../interfaces/userDetails";
import RuanService from "../../../service/ruan.service";
import { StorageKeys } from "../../../enums/storageKeys";
import StorageService from "../../../service/storage.service";

export interface StageInfoProps {
  suburb: Suburb;
  stage: number;
  onIsBusyChanged?: (data: any) => void;
}
function StageInfo({
  suburb,
  stage,
  onIsBusyChanged: isBusyProcessing,
}: StageInfoProps) {
  const ruanService = RuanService.getInstance();
  const storageService = StorageService.getInstance();
  const [scheduleData, setScheduleData] = useState<StageInfoModel[]>();
  const [loading, setLoading] = useState({});
  const [message, setMessage] = useState("Processing...");
  var doneYet = false;
  useEffect(() => {
    isBusyProcessing!(loading);
  }, [loading, message]);
  useEffect(() => {
    setTimeout(function () {
      if (doneYet == false) {
        setLoading({ isLoading: true, message: message });
      }
    }, 1000);

    const getDataRes = async () => {
      try {
        var days = await storageService.getData(StorageKeys.defaultDays);
        var res = await ruanService.getSchedule(
          suburb.blockId,
          stage,
          !days ? 5 : days,
          suburb.municipalityId
        );
        setScheduleData(res);
        doneYet = true;
        setLoading(false);
      } catch (err) {
        const error = err as any;
        setMessage(error.message.toString());
      } finally {
      }
    };
    getDataRes();
  }, []);

  const getInfo = (arr: StageInfoModel[], idx: number, stage: number) => {
    var i = idx;
    var data = "";
    while (arr[i]?.dayOfMonth === arr[idx]?.dayOfMonth) {
      if (arr[i]?.stage <= stage) {
        data += `
        <Row>
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
            }
          })}
        </Row>
      </div>
    </>
  );
}

export default StageInfo;
