import React, { useContext, useEffect, useRef, useState } from "react";
import "./App.scss";
import {
  Dropdown,
  InputGroup,
  Row,
  Tab,
  Card,
  Tabs,
  Col,
  Container,
  Button,
} from "react-bootstrap";
import { StorageKeys } from "../../enums/storageKeys";
import { Suburb } from "../../interfaces/userDetails";
import StageInfo from "../Shared/StageInfo/StageInfo";
import StorageService from "../../service/storage.service";
import LoggingService from "../../service/logging.service";
import NewSuburb from "../Shared/NewSuburb/NewSuburb";
import { MessageTypes } from "../../enums/messageTypes";
import { ThemeContext } from "../../providers/ThemeProvider";
import ThemeSelector from "../../components/themeSelector/themeSelector";

function App() {
  const [suburbList, setSuburbList] = useState<Array<Suburb>>([]);
  const [stage, setStage] = useState<number>();
  const [message, setMessage] = useState("Please wait...");
  const [lastSelectedTab, setLastSelectedTab] = useState<string>();
  const [processing, setProcessing] = useState<boolean>(false);
  const [showWhatsNew, setShowWhatsNew] = useState<boolean>(false);
  const loggingService = LoggingService.getInstance();
  const storageService = StorageService.getInstance();
  const days = useRef(5);
  const theme = useContext(ThemeContext);
  var commitToData = async () => {
    var subList = await storageService
      .getData(StorageKeys.suburbList);
    setSuburbList(subList);

    var lastSelectedKey = await storageService.getData(StorageKeys.lastSelectedTab);
    setKey(lastSelectedKey);
    setShowWhatsNew(await storageService.getData(StorageKeys.showWhatsNew));
    var defaultDaysToShow = await storageService.getData(StorageKeys.defaultDays);
    days.current = defaultDaysToShow;
  };

  useEffect(() => {

    storageService.getData(StorageKeys.currentStage).then(level => {
      setStage(level);
      commitToData();
    });


  }, []);

  useEffect(() => {
    setSuburbList([]);
    commitToData();

  }, [stage]);
  const setKey = (x: any) => {
    storageService.saveData(StorageKeys.lastSelectedTab, x);
    setLastSelectedTab(x);
    loggingService.LogToServer(MessageTypes.SUBURBVIEWED, { suburbName: x });
  };
  const exportSettings = async () => {
    let _settings = JSON.stringify(await storageService.exportData(), null, 4);

    let link = document.createElement('a'),
      blob = new Blob([_settings], { type: 'text/json' }),
      name = 'Eskom-Service-Settings.json',
      url = window.URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', name);
    link.click();
  }
  const getVariant = () => {
    switch (stage) {
      case 1:
      case 2:
        return "info";
      case 3:
      case 4:
        return "warning";
      case 5:
      case 6:
        return "danger";
      default:
        return "primary";
    }
  };
  const closeWhatsNew = async () => {
    storageService.saveData(StorageKeys.showWhatsNew, false);
    setShowWhatsNew(false);
  }
  return (
    <div className={`App`} id={theme.selectedTheme}>
      <div
        id="overlay"
        className={`${processing === true ? "overlay" : "hideOverlay"}`}
      >
        <div>{message}</div>
      </div>
      <Container>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <Dropdown
                onSelect={(e) => (e !== null ? setStage(parseInt(e)) : "")}
              >
                <Dropdown.Toggle variant={getVariant()} id="dropdown-basic">
                  Stage {stage}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {Array.from({ length: 8 }).map((_, idx) => {
                    return (
                      <Dropdown.Item eventKey={idx + 1}>
                        {idx + 1}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup>
          </Col>
          <Col>
          </Col>
          <Col style={{ display: "flex", justifyContent: "end" }}>
            <ThemeSelector></ThemeSelector>
          </Col>
        </Row>

        <Row>
          <Col>
            <Tabs
              activeKey={lastSelectedTab}
              defaultActiveKey={lastSelectedTab}
              id="uncontrolled-tab-example"
              fill
              transition
              onSelect={(k) => {
                setKey(k);
              }}
              className="mb-3"
            >
              {(showWhatsNew === true || showWhatsNew === undefined) ? <Tab eventKey={'whatsNew'} title="What's new!!">
                <p>
                <Card>
                  <Card.Header>
                    WHAT IS NEW
                  </Card.Header>
                  <Card.Body>
                    <Card.Text><ul>
                      <li>Renamed the application</li>
                      <li>Updated api Url</li>
                      <li>Removed options screen</li>
                    </ul></Card.Text>
                  </Card.Body>
                </Card>
                </p>
                  <Button onClick={closeWhatsNew}>Close</Button>
              </Tab> : ''}

              {suburbList?.map((x: Suburb) => {
                return (
                  <Tab eventKey={x.name} title={x.name}>
                    {stage &&
                      <StageInfo
                        suburb={x}
                        stage={stage ? stage : 6}
                        onIsBusyChanged={(data) => {
                          setMessage(data.message);
                          setProcessing(data.isLoading);
                        }}
                        days={days.current}
                      ></StageInfo>}
                  </Tab>
                );
              })}
              <Tab eventKey={"newSub"} title={chrome.i18n.getMessage('mySetting')}>
                <NewSuburb
                  suburbList={suburbList!}
                  onSuburbListChanged={(e) => setSuburbList(e)}
                  onIsBusyChanged={(data) => {
                    setProcessing(data.isLoading);
                    setMessage(data.message);
                  }}
                ></NewSuburb>
                <Row>
                  <Col className="footer">
                    <a target="_blank" href='https://github.com/Ruandv/sa_loadshedding_ext/issues/new/choose' rel="noreferrer"><button type="button" className="btn btn-sm btn-primary">Report an issue</button>
                    </a>
                  </Col>
                  <Col className="footer">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        exportSettings();
                      }}
                    >
                      {chrome.i18n.getMessage('exportSettings')}
                    </Button>
                  </Col>

                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
