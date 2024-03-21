import React, { useEffect, useState, useRef, useMemo } from "react";
//Import Breadcrumb
const Web3 = require("web3");
import Moment from "react-moment";
import moment from 'moment';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Helmet } from "react-helmet";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MUIDataTable from "mui-datatables";
import { Tooltip } from "@nextui-org/react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    FormFeedback,
    Form,
    Label,
    Input,
    CardTitle,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";
//redux
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
import ReactDataTable from "../../common/ReactDataTable";
import isEmpty from "../../utils/isEmpty";
import { apiBridgeUrlLYO, apiUrl } from "../../config";
import { getAllTransactions, rejectTransactionLyo , getAllChainsLyo, updateTransactionLyo } from "../../store/bridge/actions"

import Swal from "sweetalert2";
import TimeDuration from "../../common/TimeDuration";


const LyoTransactions = (props) => {
    const dispatch = useDispatch();
    const {  responseTransactionApprove, responseRejectLyo,chainsResponse } = useSelector((state) => ({     
        responseTransactionApprove: state.bridge.responseTransactionApprove,
        responseRejectLyo:  state.bridge.responseRejectLyo,
        chainsResponse: state.bridge.chainsResponse,
    }));
    let otherCopy;
    const refreshTableData = useRef(null);
    const getLoaderStatus = useRef(null);

    console.log(
        "🚀 ~ file: index.js:42 ~ const{chainsResponse}=useSelector ~ chainsResponse:",
        chainsResponse
      );
  
      const [chainData, setChainData] = useState([]);

    useEffect(() => {        
        if (responseTransactionApprove.status === 200) {           
            Swal.close();
            toast.success("Transaction Approved Successfully");
            refreshTableData.current();
        }
        else if(responseTransactionApprove?.message){
            Swal.close();
            toast.warning("Something went wrong. Please try again.");
            // refreshTableData.current();
        }
    }, [responseTransactionApprove]);

    useEffect(() => {        
        if (responseRejectLyo.status === 200) {
           
            Swal.close();
            toast.success("Transaction Rejected Successfully");
            refreshTableData.current();
        }
        else if(responseRejectLyo?.message){
            Swal.close();
            toast.warning("Something went wrong. Please try again.");
            // refreshTableData.current();
        }
    }, [responseRejectLyo]);

    useEffect(() => {
        dispatch(getAllChainsLyo());
        getChainDetails();
      }, []);
    
      useEffect(() => {
        getChainDetails();
      }, [chainsResponse, setChainData]);

   

    const columns = () => [
        {
            name: "date",
            label: "Date Created",
            options: {
                filter: false,
                sort: true,
                customBodyRender: (value) => {
                    return (
                        <>
                            <Moment format="D MMM YYYY - hh:mm A">
                                {value}
                            </Moment>
                        </>
                    );
                },
            },
        },
        {
            name: "amount",
            label: "Amount ",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (amount) => {
                    return (
                        <>
                            {(Web3.utils.fromWei(amount) * 10 ** 10).toFixed(4)}
                        </>
                    );
                },
            },

        },
        {
            name: "wallet",
            label: "Wallet Address",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (wallet) => {
                    return (
                        <>
                            {wallet}
                        </>
                    );
                },
            },
        },
        {
            name: "from",
            label: "From Network",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (from) => {
                    return (
                        <>
                            {from} 
                        </>
                    );
                },
            },
        },

        {
            name: "to",
            label: "To Network",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (to) => {                  
                    return (
                        <>
                          {/* {to} */}
                          {chainData ? (
                            chainData?.docs?.map((item, index) => {
                              return <React.Fragment key={index}>{item.chainID === to ? <>{item.name}</> : <></>}</React.Fragment>;
                            })
                          ) : (
                            <>
                              <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                  <span className="sr-only">Loading...</span>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      );
                },
            },
                
        },
        {
            name: "status",
            label: "Status",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (item) => {
                    return renderStatus(item)
                    // return item == false ? (
                    //     <span className="badge badge-soft-danger font-size-12">Pending for Approval </span>
                    // ) : (
                    //     <span className="badge badge-soft-success font-size-12">Completed</span>
                    // );
                },
            },
        },
        {
            name: "pendingTime",
            label: "Pending Time",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (item) => {                      
                    return item.isCompleted === false ? (
                        <TimeDuration createdAt = {item.createdAt}/>   
                    ) : (
                       "-"           
                    );

                },
            },
                
        },

        {
            name: "hash",
            label: "Transaction hash",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (hash) => {
                    return hash ? (
                        <div className="d-flex align-items-center gap-1">
                        {hash.slice(0, 10)}
                        {"..."}
                        {hash.slice(
                            hash.length - 6
                        )}
                        <CopyToClipboard
                            onCopy={otherCopy}
                            text={hash}
                        >
                            <Tooltip
                                content={"Copied"}
                                trigger="click"
                                color="invert"
                                placement="top"
                                css={{
                                    width: "80px",
                                    textAlign: "justify",
                                    fontSize: "11px",
                                }}
                            >
                                <i className="bx bx-copy font-size-16 align-middle me-2"></i>
                            </Tooltip>
                        </CopyToClipboard>

                    </div>
                    ) : (
                        <span>Not available</span>
                    );
                },
            },
        },
        {
            name: "id",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (item,id) => {  
                    return renderActionButtions(item)               
                },
            },
        },

    ];

    const renderActionButtions = (item) => {
      
        if(item.isCompleted == false && item.isProcessing == false){
            return (
                <>
                  <button className="btn btn-primary m-1 btn-custom" onClick={() => approveTransaction(item.id)}><i className="bx bx-check-shield font-size-16 align-middle me-2"></i>Approve</button>
                  <button className="btn btn-danger m-1 btn-custom" onClick={() => rejectTransaction(item.id)}><i className="bx bx-window-close font-size-16 align-middle me-2"></i>Reject</button>
                </>
              
            )
        }
        if(item.isCompleted == false && item.isProcessing == true){
            return (
                <>
                  <button className="btn btn-primary m-1 disabled btn-custom"><i className="bx bx-check-shield font-size-16 align-middle me-2"></i>Approve</button>
                  <button className="btn btn-danger m-1 disabled btn-custom"><i className="bx bx-window-close font-size-16 align-middle me-2"></i>Reject</button>
                </>
              
            )
        }
        if(item.isCompleted == true && item.isApproved == true){
            return (
                <button className="btn btn-primary disabled btn-custom"><i className="bx bx-check-shield font-size-16 align-middle me-2"></i>Approved</button>
            )
        }
        if(item.isCompleted == true && item.isRejected == true){
            return (
                <button className="btn btn-danger disabled btn-custom"><i className="bx bx-window-close font-size-16 align-middle me-2"></i>Rejected</button>
            )
        }

    }

    const renderStatus = (item) => {
      
        if(item.isCompleted == false && item.isProcessing == false){
            return (
                <>
                  <span className="badge badge-soft-warning font-size-12">Pending for Approval </span>
                </>
              
            )
        }
        if(item.isCompleted == false && item.isProcessing == true){
            return (
                <>
                  <span className="badge badge-soft-warning font-size-12">Processing</span>
                </>
              
            )
        }
        if(item.isCompleted == true && item.isApproved == true){
            return (
                <span className="badge badge-soft-success font-size-12">Approved</span>
            )
        }
        if(item.isCompleted == true && item.isRejected == true){
            return (
                <span className="badge badge-soft-danger font-size-12">Rejected</span>
            )
        }

    }
    

    const resultFormatter = (result) => {
        return result.docs.map((item) => {

            return {
                ...item,
                date: item.createdAt,
                status: item,
                pendingTime: item,
                amount: item.walletToBridge.amount,
                wallet: item.walletToBridge.from,
                from: item.walletToBridge.network,
                to: item.walletToBridge.chainID,
                hash: item.bridgeToWallet.transactionHash,
                id: item

            };
        });
    };

    const approveTransaction = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to approve this transaction?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: "Approving bridge request",
                    html: "Please wait...",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                dispatch(updateTransactionLyo(id));

            }
        });
    }

    const rejectTransaction = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to reject this transaction?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: "Rejecting bridge request",
                    html: "Please wait...",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                dispatch(rejectTransactionLyo(id));

            }
        });
    }

    function getChainDetails() {
        if (chainsResponse) {
        //   let allTx = chainsResponse;
    
        //   console.log("Data: ", allTx);
        //   let tempTable = [];
    
        //   for (let i = 0; i < Object.keys(allTx.docs).length; i++) {
        //     tempTable.push([allTx.docs[i].chainID, allTx.docs[i].name]);
        //   }
    
        //   console.log("temptable:", tempTable);
          setChainData(chainsResponse);
          console.log("chain data:", chainData); 
          //   console.log("chain data meh:",chainData.docs[0].chainID);
        }
      }





    return (
        <React.Fragment>
            <div className="page-content">
                <Helmet>
                    <title>Bridge Settings | LFi</title>
                </Helmet>


                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Bridge" breadcrumbItem="Transactions" />


                    <Row>
                        <Col lg="12">
                            <Card>                               
                                <CardBody className="px-0">
                                    <div className="table-responsive">
                                        <HasAnyPermission
                                            permission={["lyo bridge transaction list", "lyo bridge admin"]}
                                        >
                                            <ReactDataTable
                                                url={`${apiBridgeUrlLYO}/transactions?&isCompleted=`}
                                                columns={columns()}
                                                resultFormatter={
                                                    resultFormatter
                                                }
                                                setRefresh={
                                                    refreshTableData
                                                }
                                                getLoaderStatus={
                                                    getLoaderStatus
                                                }
                                                origin={
                                                    <div className="row">
                                                        <div className="col-auto h4">
                                                           All Transactions
                                                            &nbsp;

                                                            <button
                                                               onClick={(
                                                                e
                                                            ) => {
                                                                e.preventDefault();
                                                                refreshTableData?.current();
                                                            }}
                                                                type="button"
                                                                className="btn btn-primary waves-effect waves-light"
                                                            >
                                                                Refresh
                                                            </button>

                                                        </div>
                                                    </div>
                                                }
                                                rowsPerPage={10}
                                                limit={10}
                                            />
                                        </HasAnyPermission>
                                    </div>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default LyoTransactions;
