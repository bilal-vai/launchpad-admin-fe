import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

//Import Icons
import FeatherIcon from "feather-icons-react";

// Redux Store
import {
	showRightSidebarAction,
	toggleLeftmenu,
} from "../../store/layout/actions";
// reactstrap
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import LightDark from "../CommonForBoth/Menus/LightDark";

// import images
import logo from "../../assets/images/logo_lyo.png";
import lfi_logo from "../../assets/images/lfi-scan-logo.svg";
import lfi_logo_dark from "../../assets/images/lfi-scan-logo-light.svg";
import lfi_logo_icon from "../../assets/images/lfi-scan-icon-grayscale.svg";

import github from "../../assets/images/brands/github.png";
import bitbucket from "../../assets/images/brands/bitbucket.png";
import dribbble from "../../assets/images/brands/dribbble.png";
import dropbox from "../../assets/images/brands/dropbox.png";
import mail_chimp from "../../assets/images/brands/mail_chimp.png";
import slack from "../../assets/images/brands/slack.png";

//i18n
import { withTranslation } from "react-i18next";

//redux
import { useDispatch } from "react-redux";

const Header = (props) => {
	const dispatch = useDispatch();
	const { onChangeLayoutMode } = props;
	const [isSearch, setSearch] = useState(false);
	const [socialDrp, setsocialDrp] = useState(false);

	return (
		<React.Fragment>
			<header id="page-topbar">
				<div className="navbar-header">
					<div className="d-flex">
						<div className="navbar-brand-box">
							<Link to="/dashboard" className="logo logo-dark">
								<span className="logo-sm">
									<img src={lfi_logo_icon} alt="" height="24" />
								</span>
								<span className="logo-lg">
									<img src={lfi_logo} alt="" height="24" />
									{/* <span className="logo-txt">LFinance</span> */}
								</span>
							</Link>

							<Link to="/dashboard" className="logo logo-light">
								<span className="logo-sm">
									<img src={lfi_logo_icon} alt="" height="24" />
								</span>
								<span className="logo-lg">
									<img src={lfi_logo_dark} alt="" height="24" />
									{/* <span className="logo-txt">LFinance</span> */}
								</span>
							</Link>
						</div>

						<button
							type="button"
							className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
							data-toggle="collapse"
							onClick={() => {
								props.toggleLeftmenu(!props.leftMenu);
							}}
							data-target="#topnav-menu-content"
						>
							<i className="fa fa-fw fa-bars" />
						</button>

						{/* <form className="app-search d-none d-lg-block">
							<div className="position-relative">
								<input
									type="text"
									className="form-control"
									placeholder="Search..."
								/>
								<button
									className="btn btn-primary"
									type="button"
								>
									<i className="bx bx-search-alt align-middle"></i>
								</button>
							</div>
						</form> */}
					</div>

					<div className="d-flex">
						<div className="dropdown d-inline-block d-lg-none ms-2">
							<button
								type="button"
								className="btn header-item noti-icon "
								id="page-header-search-dropdown"
								onClick={() => setSearch(!isSearch)}
							>
								<i className="mdi mdi-magnify" />
							</button>
							<div
								className={
									isSearch
										? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
										: "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
								}
								aria-labelledby="page-header-search-dropdown"
							>
								{/* <form className="p-3">
									<div className="form-group m-0">
										<div className="input-group">
											<input
												type="text"
												className="form-control"
												placeholder={
													props.t("Search") + "..."
												}
												aria-label="Recipient's username"
											/>
											<div className="input-group-append">
												<button
													className="btn btn-primary"
													type="submit"
												>
													<i className="mdi mdi-magnify" />
												</button>
											</div>
										</div>
									</div>
								</form> */}
							</div>
						</div>

						{/* <LanguageDropdown /> */}

						{/* light / dark mode */}
						<LightDark
							layoutMode={props["layoutMode"]}
							onChangeLayoutMode={onChangeLayoutMode}
						/>

						{/* <NotificationDropdown /> */}

						<div className="dropdown d-inline-block">
							<button
								onClick={() => {
									dispatch(
										showRightSidebarAction(
											!props.showRightSidebar
										)
									);
								}}
								type="button"
								className="btn header-item noti-icon right-bar-toggle "
							>
								<FeatherIcon
									icon="settings"
									className="icon-lg"
								/>
							</button>
						</div>

						<ProfileMenu />
					</div>
				</div>
			</header>
		</React.Fragment>
	);
};

Header.propTypes = {
	leftMenu: PropTypes.any,
	showRightSidebar: PropTypes.any,
	showRightSidebarAction: PropTypes.func,
	t: PropTypes.any,
	toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = (state) => {
	return { ...state.Layout };
};

export default connect(mapStatetoProps, {
	showRightSidebarAction,
	toggleLeftmenu,
})(withTranslation()(Header));
