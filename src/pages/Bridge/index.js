import React, { useEffect, useState, useRef, useMemo } from "react";
//Import Breadcrumb
const Web3 = require("web3");
import Moment from "react-moment";
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
import { apiBridgeUrlLFI, apiUrl } from "../../config";
import {
  getAllTransactions,
  update,
  rejectTransaction,
  createBridgeTransaction
} from "../../store/bridge/actions";
import { getAllChains } from "../../store/bridge/actions";

import Swal from "sweetalert2";
import TimeDuration from "../../common/TimeDuration";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { chain } from "lodash";

const Bridge = (props) => {
  const dispatch = useDispatch();
  const { transactionResponse, response, chainsResponse, responseReject, responseAddTransaction } =
    useSelector((state) => ({
      transactionResponse: state.bridge.transactionResponse,
      response: state.bridge.response,
      chainsResponse: state.bridge.chainsResponse,
      responseReject: state.bridge.responseReject,
      response: state.bridge.response,
      responseAddTransaction: state.bridge.responseAddTransaction
    }));

  const animatedComponents = makeAnimated();
  let otherCopy;
  const refreshTableData = useRef(null);
  const getLoaderStatus = useRef(null);
  const [isOpenAddTXModal, toggleAddTXModal] = useState(false);
  const [txData, setTxData] = useState();
  const [chainData, setChainData] = useState([]);
  const [tokenOptions, setTokenOptions] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState([]);
  const [txDetails, handleTXFormData] = useState([
    {
      transactionHash: "",
      network: "",
      token: "",
    },
  ]);
  const [seed, setSeed] = useState(1);
  const reset = () => {
    setSeed(Math.random());
    refreshTableData?.current();

  }

  useEffect(() => {
    dispatch(getAllChains());
    getChainDetails();
  }, []);

  useEffect(() => {
    getTokenOptions(selectedNetwork)
  }, [selectedNetwork]);

  useEffect(() => {
    getChainDetails();
  }, [chainsResponse, setChainData]);

  useEffect(() => {
    if (response.status === 200) {
      console.log('response', response);
      Swal.close();
      toast.success("Transaction Approved Successfully");
      Object.keys(response).forEach((item) => {
        response[item] = undefined;
      })
      refreshTableData.current();
    } else if (response?.message) {
      Swal.close();
      toast.warning("Something went wrong");
      Object.keys(response).forEach((item) => {
        response[item] = undefined;
      })
    }
    else if (response.status == undefined) {

      return
    }
  }, [response]);

  useEffect(() => {
    if (responseReject.status === 200) {
      Swal.close();
      toast.success("Transaction Rejected Successfully");
      Object.keys(responseReject).forEach((item) => {
        responseReject[item] = undefined;
      })
      refreshTableData.current();
    } else if (responseReject?.message) {
      Swal.close();
      toast.warning("Something went wrong. Please try again.");
      Object.keys(responseReject).forEach((item) => {
        responseReject[item] = undefined;
      })
      // refreshTableData.current();
    }
    else if (responseReject.status == undefined) {

      return
    }
  }, [responseReject]);

  useEffect(() => {
    if (responseAddTransaction.status === 200) {
      Swal.close();
      toast.success("Transaction Added Successfully");     
      refreshTableData.current();
    } else if (responseAddTransaction?.message) {
      Swal.close();
      toast.warning("Something went wrong. Please try again");     
      // refreshTableData.current();
    }
    else if (responseAddTransaction.status == undefined) {

      return
    }
  }, [responseAddTransaction]);

  const datatableOptions = {
    filterType: "dropdown",
    selectableRows: false,
    responsive: "standard",
    sort: true,
    filter: true,
    download: false,
    rowsPerPage: 10,
  };

  const renderActionButtions = (item) => {
    if (item.isCompleted == true) {
      if (item.isApproved == true) {
        return (
          <button className="btn btn-primary disabled btn-custom">
            <i className="bx bx-check-shield font-size-16 align-middle me-2"></i>
            Approved
          </button>
        );
      }
      if (item.isRejected == true) {
        return (
          <button className="btn btn-danger disabled btn-custom">
            <i className="bx bx-window-close font-size-16 align-middle me-2"></i>
            Rejected
          </button>
        );
      }
    } else {
      return (
        <>
          <button
            className="btn btn-primary m-1 btn-custom"
            onClick={() => approveTransaction(item.id)}
          >
            <i className="bx bx-check-shield font-size-16 align-middle me-2"></i>
            Approve
          </button>
          <button
            className="btn btn-danger m-1 btn-custom"
            onClick={() => rejectTransactionRequest(item.id)}
          >
            <i className="bx bx-window-close font-size-16 align-middle me-2"></i>
            Reject
          </button>
        </>
      );
    }
  };

  const renderStatus = (item) => {
    if (item.isCompleted == true) {
      if (item.isApproved == true) {
        return (
          <span className="badge badge-soft-success font-size-12">
            Approved
          </span>
        );
      }
      if (item.isRejected == true) {
        return (
          <span className="badge badge-soft-danger font-size-12">Rejected</span>
        );
      }
    } else {
      if (item.isProcessing == false) {
        return (
          <>
            <span className="badge badge-soft-warning font-size-12">
              Pending for Approval{" "}
            </span>
          </>
        );
      }
      if (item.isProcessing == true) {
        return (
          <>
            <span className="badge badge-soft-warning font-size-12">
              Processing
            </span>
          </>
        );
      }
    }
  };


  const rendrenderFilterStatus = (item) => {
    if (item.isCompleted == true) {
      if (item.isApproved == true) {
        return "Approved"
      }
      if (item.isRejected == true) {
        return "Rejected"
      }
    } else {
      if (item.isProcessing == false) {
        return "Pending for Approval"
      }
      if (item.isProcessing == true) {
        return "Processing"
      }
    }


  }
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
              <Moment format="D MMM YYYY - hh:mm A">{value}</Moment>
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
          return (Web3.utils.fromWei(amount) * 10 ** 10).toFixed(4)
        },
      },
    },
    {
      name: "tokenSymbol",
      label: "Token ",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (tokenSymbol) => {
          return tokenSymbol
        },
        filterType: "custom",
        filterOptions: {
          names: [],
          display: (filterList, onChange, index, column) => {
            const optionValues = ["LFi", "cLFi"];
            return (
              <div className="auto">
                <label>Token</label>
                <select
                  value={filterList[index][0] || ""}
                  onChange={(event) => {
                    filterList[index][0] =
                      event.target.value;
                    onChange(
                      filterList[index],
                      index,
                      column
                    );
                  }}
                  className="form-control"
                  name="currency-transaction"
                >
                  <option disabled value="">
                    Select a Token
                  </option>
                  {optionValues.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            );
          },
        },
      },
    },
    {
      name: "wallet",
      label: "Wallet Address",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (wallet) => {
          return <>
            <div className="d-flex align-items-center gap-1">
              {wallet.slice(0, 5)}
              {"..."}
              {wallet.slice(
                wallet.length - 4
              )}

              <CopyToClipboard
                onCopy={otherCopy}
                text={wallet}
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
          </>;
        },
      },
    },
    {
      name: "from",
      label: "From Network",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (from) => {
          return (
            <>
              {/* {to} */}
              {chainData ? (
                chainData?.docs?.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      {item.slug === from ? <>{item.name}</> : <></>}
                    </React.Fragment>
                  );
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
        filterType: "custom",
        filterOptions: {
          names: [],
          display: (filterList, onChange, index, column) => {
            const optionValues = chainData?.docs;
            return (
              <div className="auto">
                <label>From Network</label>
                <select
                  value={filterList[index][0] || ""}
                  onChange={(event) => {
                    filterList[index][0] =
                      event.target.value;
                    onChange(
                      filterList[index],
                      index,
                      column
                    );
                  }}
                  className="form-control"
                  name="currency-transaction"
                >
                  <option disabled value="">
                    Select Network
                  </option>
                  {optionValues.map((item) => (
                    <option key={item.chainID} value={item.chainID}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            );
          },
        },
        customFilterListOptions: {
          render: v => {
            [0]
            if (v[0] === "137") {
              return "Matic";
            }
            if (v[0] === "1") {
              return "Ethereum";
            }
            if (v[0] === "11155111") {
              return "Ethereum Sepolia";
            }
            if (v[0] === "80001") {
              return "Matic Mumbai";
            }
          }

        }
      },
    },

    {
      name: "to",
      label: "To Network",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (to) => {
          return (
            <>
              {/* {to} */}
              {chainData ? (
                chainData?.docs?.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      {item.chainID === to ? <>{item.name}</> : <></>}
                    </React.Fragment>
                  );
                })
              ) : (
                <>
                  <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                </>
              )}
            </>
          );
        },
        filterType: "custom",
        filterOptions: {
          names: [],
          display: (filterList, onChange, index, column) => {
            const optionValues = chainData?.docs;
            return (
              <div className="auto">
                <label>To Network</label>
                <select
                  value={filterList[index][0] || ""}
                  onChange={(event) => {
                    filterList[index][0] =
                      event.target.value;
                    onChange(
                      filterList[index],
                      index,
                      column
                    );
                  }}
                  className="form-control"
                  name="currency-transaction"
                >
                  <option disabled value="">
                    Select Network
                  </option>
                  {optionValues.map((item) => (
                    <option key={item.chainID} value={item.chainID}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            );
          },
        },
        customFilterListOptions: {
          render: v => {
            [0]
            if (v[0] === "137") {
              return "Matic";
            }
            if (v[0] === "1") {
              return "Ethereum";
            }
            if (v[0] === "11155111") {
              return "Ethereum Sepolia";
            }
            if (v[0] === "80001") {
              return "Matic Mumbai";
            }
          }

        }

      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: false,
        sort: false,
        download: false,
        customBodyRender: (item) => {
          return renderStatus(item);
        },
      },
    },
    {
      name: "statusVal",
      label: "Status",
      hide: true,
      options: {
        filter: true,
        sort: false,
        searchable: true,
        display: "excluded",
        download: false,
        customBodyRender: (item) => {
          return rendrenderFilterStatus(item);
        },
        filterType: "custom",
        filterOptions: {
          names: [],
          display: (filterList, onChange, index, column) => {
            const optionValues = ["Pending for Approval", "Approved", "Rejected"];
            return (
              <div className="auto">
                <label>Status</label>
                <select
                  value={filterList[index][0] || ""}
                  onChange={(event) => {
                    filterList[index][0] =
                      event.target.value;
                    onChange(
                      filterList[index],
                      index,
                      column
                    );
                  }}
                  className="form-control"
                  name="currency-transaction"
                >
                  <option disabled value="">
                    Select Status
                  </option>
                  {optionValues.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            );
          },
        },
      },
    },
    {
      name: "rejectedReason",
      label: "Rejected Reason",
      options: {
        filter: false,
        sort: false,
        download: false,
        customBodyRender: (item) => {
          return item.isRejected === true ? (
            <>{item.rejectedReason}</>
          ) : (
            "-"
          );
        },
      },
    },
    {
      name: "pendingTime",
      label: "Pending Time",
      options: {
        filter: false,
        sort: false,
        download: false,
        customBodyRender: (item) => {
          return (
            <TimeDuration createdAt={item.createdAt} />

          );
        },
      },
    },
    {
      name: "completedAt",
      label: "Approved/Rejected Time",
      options: {
        filter: false,
        sort: false,
        download: false,
        customBodyRender: (item) => {
          return item.isCompleted === true ? (
            <TimeDuration createdAt={item.completedAt} />
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
        download: false,
        customBodyRender: (item) => {
          return item.bridgeToWallet.transactionHash ? (
            <div className="d-flex align-items-center gap-1">
              {
                item.isRejected == true ?
                  <a href={getBlockExploreLink(item.walletToBridge.fromChainID) + "tx/" + item.bridgeToWallet.transactionHash} target="_blank" className="text-dark text-decoration-underline">
                    {item.bridgeToWallet.transactionHash.slice(0, 10)}
                    {"..."}
                    {item.bridgeToWallet.transactionHash.slice(
                      item.bridgeToWallet.transactionHash.length - 6
                    )}
                  </a>
                  :
                  <a href={getBlockExploreLink(item.bridgeToWallet.chainID) + "/tx/" + item.bridgeToWallet.transactionHash} target="_blank" className="text-dark text-decoration-underline">
                    {item.bridgeToWallet.transactionHash.slice(0, 10)}
                    {"..."}
                    {item.bridgeToWallet.transactionHash.slice(
                      item.bridgeToWallet.transactionHash.length - 6
                    )}
                  </a>
              }


              <CopyToClipboard
                onCopy={otherCopy}
                text={item.bridgeToWallet.transactionHash}
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
      name: "hashDownloadable",
      label: "TX Hash",
      hide: true,
      options: {
        filter: false,
        sort: false,
        display: "excluded",


      },
    },
    {
      name: "id",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        download: false,
        customBodyRender: (item, id) => {
          return renderActionButtions(item);
        },
      },
    },
  ];

  const getBlockExploreLink = (id) => {
    for (var chain in chainData?.docs) {
      if (chainData?.docs[chain].chainID == id) {
        return chainData?.docs[chain].blockExplorerUrl
      }
    }
  }

  const resultFormatter = (result) => {
    return result.docs.map((item) => {
      return {
        ...item,
        date: item.createdAt,
        status: item,
        statusVal: item,
        tokenSymbol: item.tokenSymbol,
        pendingTime: item,
        completedAt: item,
        rejectedReason: item,
        amount: item.walletToBridge.amount,
        wallet: item.walletToBridge.from,
        from: item.walletToBridge.network,
        to: item.walletToBridge.chainID,
        hash: item,
        hashDownloadable: item.bridgeToWallet.transactionHash,
        id: item,
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
          title: "Approving Transaction",
          html: "Please wait...",
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        dispatch(update(id));
      }
    });
  };

  const rejectTransactionRequest = (id) => {
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
          icon: "warning",
          title: "Rejecting Transaction!!",
          text: "Why do you want to reject this transaction?",
          input: "text",
          inputAttributes: {
            autocapitalize: "off",
          },
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirm",
          showLoaderOnConfirm: true,

          preConfirm: (rejectReason) => {


            return dispatch(rejectTransaction(id, rejectReason)
              // .then((value) => {
              //   if (value) {
              //     console.log(value); ;
              //   } else {
              //     Swal.showValidationMessage("Server error !");
              //   }
              // })
              // .catch((error) => {
              //   Swal.showValidationMessage(`Request failed: ${error}`);
              // })
            );



          },
          allowOutsideClick: () => !Swal.isLoading(),
          inputValidator: (value) => {
            return !value && "Please enter a valid reason!";
          },
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
          }
        });
      }
    });
  };

  function getChainDetails() {
    if (chainsResponse) {
      setChainData(chainsResponse?.docs);
    }
  }

  const getChainsOption = useMemo(() => {
    const result = chainData?.map((item) => ({
      label: `${item.name}`,
      value: item.chainID,
      name: item.name,
      _id: item._id
    }));
    return result ?? [];
  }, [chainData]);

  function getTransactions() {
    setTxData([]);

    if (transactionResponse) {
      let allTx = transactionResponse.docs;
      let tempTable = [];

      for (let i = 0; i < allTx.length; i++) {
        tempTable.push([
          allTx[i].createdAt,

          (
            Web3.utils.fromWei(allTx[i].walletToBridge.amount) *
            10 ** 10
          ).toFixed(4),
          // allTx[i].walletToBridge.amount,

          allTx[i].walletToBridge.from,

          allTx[i].walletToBridge.network,

          allTx[i].walletToBridge.chainID,
          allTx[i].isCompleted == true ? "Completed" : "Pending for Approval",

          <span key={i}>
            {allTx[i].bridgeToWallet.transactionHash ? (
              <div className="d-flex align-items-center gap-1">
                {allTx[i].bridgeToWallet.transactionHash.slice(0, 10)}
                {"..."}
                {allTx[i].bridgeToWallet.transactionHash.slice(
                  allTx[i].bridgeToWallet.transactionHash.length - 6
                )}
                <CopyToClipboard
                  onCopy={otherCopy}
                  text={allTx[i].bridgeToWallet.transactionHash}
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
              "Not available"
            )}
          </span>,

          allTx[i].isCompleted == false && allTx[i].isProcessing == false ? (
            <button
              className="btn btn-primary"
              onClick={() => approveTransaction(allTx[i]._id)}
            >
              <i className="bx bx-check-shield font-size-16 align-middle me-2"></i>{" "}
              Approve
            </button>
          ) : (
            <button className="btn btn-warning disabled">
              <i className="bx bx-check-shield font-size-16 align-middle me-2"></i>{" "}
              Approved
            </button>
          ),
        ]);
      }
      setTxData(tempTable);
    }
  }

  let validationSchema = {
    transactionHash: Yup.string().required("Please enter a transaction hash."),
    network: Yup.object().required("Please select a network."),
    token: Yup.object().required("Please select a token."),
  };

  const useFormikOptions = {
    // enableReinitialize: true,
    initialValues: {
      transactionHash: txDetails && txDetails.transactionHash ? txDetails.transactionHash : "",
      network: txDetails && txDetails.network ? txDetails.network : "",
      token: txDetails && txDetails.token ? txDetails.token : "",
    },
    validationSchema: Yup.object(validationSchema),
    onSubmit: (values) => {     
      const formData = {       
        transactionHash: values.transactionHash,
        chainID: values.network.value,
        tokenAddress: values.token.tokenAddress,
        bridgeAddress: values.token.bridgeAddress,
        amount: 0
      };
    
      dispatch(createBridgeTransaction(formData));
    },
  };

  const validation = useFormik(useFormikOptions);

  const handleAddTXModal = (data = null) => {
    handleTXFormData([
      {
        transactionHash: "",
        network: "",
        token: "",

      },
    ]);
    validation.resetForm();

    toggleAddTXModal(!isOpenAddTXModal);
  };

  const getTokenOptions = (data) => {
    const selectedChain = chainData?.find((chain) => chain?._id === data?._id)
   
    if (selectedChain) {
      const result = selectedChain?.tokens?.map((item) => ({
        label: `${item.symbol}`,
        value: item.symbol,
        name: item.symbol,
        tokenAddress: item.address,
        bridgeAddress: item.bridgeAddress,
        _id: item._id
      }));
      setTokenOptions(result)
    }


  };

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
              <Card key={seed}>
                <CardBody className="px-0">
                  <div className="table-responsive">
                    <HasAnyPermission
                      permission={["bridge transaction list", "bridge admin"]}
                    >
                      <ReactDataTable
                        url={`${apiBridgeUrlLFI}/transactions/pagination?isWalletToBridgeCompleted=true`}
                        columns={columns()}
                        resultFormatter={resultFormatter}
                        setRefresh={refreshTableData}
                        getLoaderStatus={getLoaderStatus}
                        origin={
                          <div className="row">
                            <div className="col-auto h4">
                              All Transactions &nbsp;
                              <button
                                onClick={(e) => {
                                  reset()
                                }}
                                type="button"
                                className="btn btn-primary waves-effect waves-light m-2"
                              >
                                Refresh
                              </button>
                              <button
                                onClick={(e) => {
                                  handleAddTXModal()
                                }}
                                type="button"
                                className="btn btn-success waves-effect waves-light"
                              >
                                Add Wallet To Bridge TX
                              </button>
                            </div>
                          </div>
                        }
                        rowsPerPage={10}
                        limit={10}
                        searchPlaceholder='Search By Wallet Address, TX Hash'
                      />

                      <Modal
                        isOpen={isOpenAddTXModal}
                        toggle={handleAddTXModal}
                        backdrop={"static"}
                        size="lg"
                        centered={true}
                      >
                        <ModalHeader
                          toggle={handleAddTXModal}
                          tag="h4"
                        >
                          Add Wallet to Bridge Transaction
                        </ModalHeader>

                        <ModalBody>
                          <Form
                            disabled
                            onSubmit={(e) => {
                              e.preventDefault();
                              validation.handleSubmit();
                              return false;
                            }}
                          >
                            <fieldset>
                              <div className="row">
                                <div className="mb-3">
                                  <label className="control-label">Select Network</label>
                                  <Select
                                    name="network"
                                    value={
                                      validation.values.network || ""
                                    }
                                    onChange={(
                                      value,
                                      action
                                    ) => {
                                      validation.setFieldValue(
                                        "network",
                                        value
                                      );
                                      setSelectedNetwork(value)
                                      validation.setFieldValue(
                                        "token",
                                        []
                                      );
                                    }}
                                    isMulti={false}
                                    options={getChainsOption}
                                    classNamePrefix="select2-selection"
                                    onSelectResetsInput={true}
                                    closeMenuOnSelect={true}
                                    components={animatedComponents}
                                  />
                                </div>
                              </div>

                              {tokenOptions?.length > 0 &&
                                <div className="row">
                                  <div className="mb-3">
                                    <label className="control-label">Select Token</label>
                                    <Select
                                      name="token"
                                      value={
                                        validation.values.token || ""
                                      }
                                      onChange={(
                                        value,
                                        action
                                      ) => {
                                        validation.setFieldValue(
                                          "token",
                                          value
                                        );
                                      }}
                                      isMulti={false}
                                      options={tokenOptions}
                                      classNamePrefix="select2-selection"
                                      onSelectResetsInput={true}
                                      closeMenuOnSelect={true}
                                      components={animatedComponents}
                                    />
                                  </div>
                                </div>
                              }

                              <Row>
                                <div className="mb-3">
                                  <Label className="form-label">Transaction Hash</Label>
                                  <Input
                                    name="transactionHash"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.transactionHash || ""}
                                    invalid={
                                      validation.touched.transactionHash &&
                                        validation.errors.transactionHash
                                        ? true
                                        : false
                                    }
                                  ></Input>

                                  {validation.touched.transactionHash &&
                                    validation.errors.transactionHash ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.transactionHash}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Row>

                              <Row>
                                <Col>
                                  <div className="text-end mt-3">
                                    <button
                                      type="submit"
                                      className="btn btn-success save-user"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </Col>
                              </Row>
                            </fieldset>
                          </Form>
                        </ModalBody>
                      </Modal>
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

export default Bridge;
