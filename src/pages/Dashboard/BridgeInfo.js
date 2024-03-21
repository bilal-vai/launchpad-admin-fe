import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  getBridgeConfig,
  getTransactionStats,
  getVolumeInfo,
  getGatewayBalances
} from "../../store/bridge/actions";

const BridgeInfo = () => {
  const [bridgeInfo, setBridgeInfo] = useState();
  const [transactionstats, setTransactionstats] = useState([]);
  const [volumeInfo, setVolumeInfo] = useState([]);
  const [gatewayBalances, setGatewayBalances] = useState([]);

  const dispatch = useDispatch();
  const { responseConfig, responseTransactionStats, responseVolumeInfo, responseGatewayBalances } =
    useSelector((state) => ({
      responseConfig: state.bridge.responseConfig,
      responseTransactionStats: state.bridge.responseTransactionStats,
      responseVolumeInfo: state.bridge.responseVolumeInfo,
      responseGatewayBalances: state.bridge.responseGatewayBalances
    }));

  useEffect(() => {
    dispatch(getBridgeConfig());
    dispatch(getTransactionStats());
    dispatch(getVolumeInfo());
    dispatch(getGatewayBalances());
  }, []);


  useEffect(() => {
    if (responseTransactionStats.status === 200) {
      setTransactionstats(responseTransactionStats.data.data);
    }
  }, [responseTransactionStats]);


  useEffect(() => {
    if (responseVolumeInfo.status === 200) {
      setVolumeInfo(responseVolumeInfo.data.data);
    }
  }, [responseVolumeInfo]);

  useEffect(() => {
    if (responseGatewayBalances.status === 200) {
      setGatewayBalances(responseGatewayBalances.data.data.gatewayBalances);
    }
  }, [responseGatewayBalances]);


  useEffect(() => {
    if (responseConfig.status === 200) {
      setBridgeInfo([]);
      let allBridgeInfo = responseConfig.data.data.tokenVolumes;    
      const tempBridgeInfo = [];
      const temvar = "";

      for (
        let i = 0;
        i < Object.keys(responseConfig.data.data.tokenVolumes).length;
        i++
      ) {
        tempBridgeInfo.push(responseConfig.data.data.tokenVolumes[i]);
      }
      setBridgeInfo(temvar);
      setBridgeInfo(tempBridgeInfo);
    }
  }, [responseConfig, setBridgeInfo]);

  return (
    <React.Fragment>
      <Row xl={3} md={5}>
        {Object.keys(volumeInfo).length > 0 ? (
          volumeInfo.totalLockedAmounts.map((item, index) => {
            return (
              <Col xl={3} sm={5} md={5} lg={5}>
                <Card className="card-h-100 card-info info-primary">
                  <CardBody>
                    {/* <h3>{bridgeInfo ? bridgeInfo.tokenVolume : "-"}</h3> */}

                    {Object.keys(item).length > 0 ? (
                      <h5  className="card-title me-2">Total Locked Amounts - {item.name}</h5>
                    ) : (
                      <h5 className="card-title placeholder-glow">
                        <span className="placeholder col-5"></span>
                      </h5>
                    )}
                    {item.tokens.map((itm, indx) => {
                      return (
                        <div className="mt-4" key={indx}>                     
                          {Object.keys(itm).length > 0 ? (
                            <h4>{(itm.totalLockedAmount)?.toString()} {itm.symbol}</h4>
                          ) : (
                            <h5 className="card-title placeholder-glow">
                              <span className="placeholder col-5"></span>
                            </h5>
                          )}
                        </div>
                      )
                    })}

                  </CardBody>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col xl={3}>
            <Card className="card-h-100 card-info info-total-locked">
              <CardBody>
                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-5"></span>
                </h5>

                <h5 className="card-title me-2">Total Locked Amount</h5>

                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-5"></span>
                </h5>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
      <Row xl={3} md={5}>
        {Object.keys(gatewayBalances).length > 0 ? (
          gatewayBalances.map((item, index) => {
            return (
              <Col xl={3} sm={5} md={5} lg={5}>
                <Card className="card-h-100 card-info info-primary">
                  <CardBody>
                    <h5  className="card-title me-2">Gateway Balances - {item.name}</h5>
                    {item.tokens?.map((token, index) => {
                      return (
                        <>       
                        <div class="mt-4"><h4>{token?.token} - {(parseFloat(token.gatewayBalance)).toFixed(4)} {token.symbol}</h4></div>                        
                        </>                      
                      );
                    })}
                  </CardBody>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col xl={3}>
            <Card className="card-h-100 card-info info-total-locked">
              <CardBody>
                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-5"></span>
                </h5>

                <h5 className="card-title me-2">Gateway Balance</h5>

                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-5"></span>
                </h5>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>
      <Row xl={3}>
        <Col xl={3}>
          <Card className="card-h-100 card-info info-approve-pending">
            <CardBody>
              <h5 className="card-title me-2">Pending For Approval Count</h5>
              <br />
              {Object.keys(transactionstats).length > 0 ? (
                <h3>{transactionstats.pendingForApprovalCount}</h3>
              ) : (
                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-5"></span>
                </h5>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col xl={3}>
          <Card className="card-h-100 card-info info-success">
            <CardBody>
              <h5 className="card-title me-2">Approved Count</h5>
              <br />
              {Object.keys(transactionstats).length > 0 ? (
                <h3>{transactionstats.approvedCount}</h3>
              ) : (
                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-5"></span>
                </h5>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col xl={3}>
          <Card className="card-h-100 card-info info-secondary">
            <CardBody>
              <h5 className="card-title me-2">RejectedTx Count</h5>
              <br />
              {Object.keys(transactionstats).length > 0 ? (
                <h3>{transactionstats.rejectedTxCount}</h3>
              ) : (
                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-5"></span>
                </h5>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row xl={3}>
        <Col xl={3} sm={5}>
          <Card className="card-h-100 card-info info-volume">
            <CardBody>
              {/* <h3>{bridgeInfo ? bridgeInfo.tokenVolume : "-"}</h3> */}

              <h5 className="card-title me-2">ApprovedTx Volume</h5>
              {Object.keys(volumeInfo).length > 0 ? (
                <h3>{volumeInfo.approvedTxVolume / 100000000}</h3>
              ) : (
                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-5"></span>
                </h5>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col xl={3} sm={5}>
          <Card className="card-h-100 card-info info-pending">
            <CardBody>
              {/* <h3>{bridgeInfo ? bridgeInfo.tokenVolume : "-"}</h3> */}

              <h5 className="card-title me-2">Pending For Approval Volume</h5>

              {Object.keys(volumeInfo).length > 0 ? (
                <h3>{(volumeInfo.pendingForApprovalVolume / 100000000)}</h3>
              ) : (
                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-5"></span>
                </h5>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>


    </React.Fragment>
  );
};

export default BridgeInfo;
