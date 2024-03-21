import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

//Import Icons
import FeatherIcon from "feather-icons-react";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import LightDark from "../CommonForBoth/Menus/LightDark";

// import images
// import logoSvg from "../../assets/images/logo-sm.svg";
import logoSvg from "../../assets/images/logo_lyo.png";
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
import { useSelector, useDispatch } from "react-redux";

// Redux Store
import {
	showRightSidebarAction,
	toggleLeftmenu,
	changeSidebarType,
	changelayoutMode,
} from "../../store/layout/actions";

const Header = (props) => {
	const dispatch = useDispatch();
	const { showRightSidebar } = useSelector((state) => ({
		showRightSidebar: state.Layout.ShowRightSidebar,
	}));
	const { onChangeLayoutMode } = props;
	const [search, setsearch] = useState(false);
	const [socialDrp, setsocialDrp] = useState(false);
	const [isClick, setClick] = useState(true);

	/*** Sidebar menu icon and default menu set */
	function tToggle() {
		var body = document.body;
		setClick(!isClick);
		if (isClick === true) {
			body.classList.add("sidebar-enable");
			document.body.setAttribute("data-sidebar-size", "sm");
		} else {
			body.classList.remove("sidebar-enable");
			document.body.setAttribute("data-sidebar-size", "lg");
		}
	}

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
									<img src={lfi_logo} alt="" height="24" />{" "}
									{/* <span className="logo-txt">LFinance</span> */}
								</span>
							</Link>

							<Link to="/dashboard" className="logo logo-light">
								<span className="logo-sm">
									<img src={lfi_logo_icon} alt="" height="24" />
								</span>
								<span className="logo-lg">
									<img src={lfi_logo_dark} alt="" height="24" />{" "}
									{/* <span className="logo-txt">LFinance</span> */}
								</span>
							</Link>
						</div>

						<button
							onClick={() => {
								tToggle();
							}}
							type="button"
							className="btn btn-sm px-3 font-size-16 header-item"
							id="vertical-menu-btn"
						>
							<i className="fa fa-fw fa-bars"></i>
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
								className="btn header-item"
								id="page-header-search-dropdown"
								data-bs-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								<FeatherIcon
									icon="search"
									className="icon-lg"
								/>
							</button>
							<div
								className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
								aria-labelledby="page-header-search-dropdown"
							>
								<form className="p-3">
									<div className="form-group m-0">
										<div className="input-group">
											<input
												type="text"
												className="form-control"
												placeholder="Search ..."
												aria-label="Search Result"
											/>

											<button
												className="btn btn-primary"
												type="submit"
											>
												<i className="mdi mdi-magnify"></i>
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="d-flex">
						<div className="dropdown d-inline-block d-lg-none ms-2">
							<button
								onClick={() => {
									setsearch(!search);
								}}
								type="button"
								className="btn header-item noti-icon "
								id="page-header-search-dropdown"
							>
								<i className="mdi mdi-magnify" />
							</button>
							<div
								className={
									search
										? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
										: "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
								}
								aria-labelledby="page-header-search-dropdown"
							>
								<form className="p-3">
									<div className="form-group m-0">
										<div className="input-group">
											<input
												type="text"
												className="form-control"
												placeholder="Search ..."
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
								</form>
							</div>
						</div>

						{/* <LanguageDropdown /> */}

						{/* light / dark mode */}
						<LightDark
							layoutMode={props["layoutMode"]}
							onChangeLayoutMode={onChangeLayoutMode}
						/>

						{/* <NotificationDropdown /> */}						
						<ProfileMenu />
					</div>
				</div>
			</header>
		</React.Fragment>
	);
};

Header.propTypes = {
	changeSidebarType: PropTypes.func,
	leftMenu: PropTypes.any,
	showRightSidebar: PropTypes.any,
	showRightSidebarAction: PropTypes.func,
	t: PropTypes.any,
	toggleLeftmenu: PropTypes.func,
	changelayoutMode: PropTypes.func,
	layoutMode: PropTypes.any,
};

const mapStatetoProps = (state) => {
	const { layoutType, showRightSidebar, leftMenu, layoutMode } = state.Layout;
	return { layoutType, showRightSidebar, leftMenu, layoutMode };
};

export default connect(mapStatetoProps, {
	showRightSidebarAction,
	changelayoutMode,
	toggleLeftmenu,
	changeSidebarType,
})(withTranslation()(Header));
