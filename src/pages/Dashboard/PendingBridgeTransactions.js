import React, { useMemo, useRef, useState, useEffect } from "react";
const Web3 = require("web3");
import { CardBody, Table } from "reactstrap";
import { apiBridgeUrlLFI, wsUrl } from "../../config";
import { io } from "socket.io-client";
import moment from "moment";
import HasAnyPermission from "../../common/Permission";
import { useSelector, useDispatch } from "react-redux";
import { getAllTransactions, update } from "../../store/bridge/actions"
import { CopyToClipboard } from "react-copy-to-clipboard";
import MUIDataTable from "mui-datatables";
import { Tooltip } from "@nextui-org/react";
import Moment from "react-moment";
import Swal from "sweetalert2";
import ReactDataTable from "../../common/ReactDataTable";
import { toast } from "react-toastify";
const PendingBridgeTransactions = () => {
    const refreshTableData = useRef(null);
    const getLoaderStatus = useRef(null);
    const [totalTransactions, setTotalTransaction] = useState([]);
    const [totalPendingTransactions, setTotalPendingTransactions] = useState([]);
    const dispatch = useDispatch();
    const { transactionResponse, response } = useSelector((state) => ({
        transactionResponse: state.bridge.transactionResponse,
        response: state.bridge.response,
    }));
    let otherCopy;
    const [txData, setTxData] = useState();



    useEffect(() => {

        if (response.status === 400) {
            Swal.close();
            toast.warning(response.message);
            refreshTableData.current();
        }
        if (response.status === 200) {
            Swal.close();
            toast.success("Transaction Approved Successfully");
            refreshTableData.current();
        }
    }, [response]);


    const datatableOptions = {
        filterType: "dropdown",
        selectableRows: false,
        responsive: "standard",
        sort: true,
        filter: true,
        download: false,
    };

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
                            {to}

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
                customBodyRender: (status) => {
                    return status == false ? (
                        <span className="badge badge-soft-danger font-size-12">Pending for Approval</span>
                    ) : (
                        <span className="badge badge-soft-success font-size-12">Completed</span>
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
                        hash
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
                customBodyRender: (id) => {
                    return (
                        <>
                            <button className="btn btn-primary" onClick={() => approveTransaction(id)}><i className="bx bx-check-shield font-size-16 align-middle me-2"></i> Approve</button>
                        </>
                    );

                },
            },
        },

    ];

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
                    title: "Updating",
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
    }

    const resultFormatter = (result) => {
        return result.docs.map((item) => {

            return {
                ...item,
                date: item.createdAt,
                status: item.isCompleted,
                amount: item.walletToBridge.amount,
                wallet: item.walletToBridge.from,
                from: item.walletToBridge.network,
                to: item.walletToBridge.chainID,
                hash: item.bridgeToWallet.transactionHash,
                id: item._id

            };
        });
    };


    return (
        <React.Fragment>
            <div className="col-xl-12">
                <div className="card">
                    <CardBody className="px-0">
                        <div className="table-responsive">
                            <HasAnyPermission
                                permission={[
                                    "bridge networks list",
                                    "bridge admin"
                                ]}
                            >

                                <ReactDataTable
                                    url={`${apiBridgeUrlLFI}/transactions?&isCompleted=false`}
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
                                                Pending Transactions
                                                &nbsp;

                                                <button
                                                    onClick={() => {
                                                        dispatch(getAllTransactions(false))
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
                </div>
            </div>
        </React.Fragment>
    );
};

export default PendingBridgeTransactions;
