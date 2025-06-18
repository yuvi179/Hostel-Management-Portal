import React from 'react';
import "./Page1.css";
import { useNavigate } from 'react-router-dom';
import CreateStudent from './Resource/CreateStudent';
import { FaGithub, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaRegCopyright } from 'react-icons/fa';

export default function Page1() {
const navigate = useNavigate();

  return (
    <div id="id-1" className="d-flex h-100">
      <div id="id-3" className="h-100">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/IIIT_Bangalore_Logo.svg/1200px-IIIT_Bangalore_Logo.svg.png"
          alt=""
          className="d-flex flex-column h-50"
          id="id-5"
        />

        <div className="" id="id-7">International Institute of <br /> Information Technology Bangalore</div>
        <div className="" id="id-9">HOSTEL MANAGEMENT SYSTEM</div>

        <div className="white-line"></div>
        <div className="iconLinks" style={{display : "flex"}}>
          <p><a className="text-decoration-none" href="https://github.com/IIITBangalore" id="id-B">
            <FaGithub style={{ marginRight: '16px' }} color="gray" size={15}/></a>
          </p>
          <p><a className="text-decoration-none" href="https://www.facebook.com/IIITBofficial/" id="id-D">
            <FaFacebookF style={{ marginRight: '16px' }} color="gray" size={15}/></a>
          </p>
          <p><a className="text-decoration-none" href="https://x.com/IIITB_official/" id="id-F">
            <FaTwitter style={{ marginRight: '16px' }} color="gray" size={15}/></a>
          </p>
          <p><a className="text-decoration-none" href="https://in.linkedin.com/school/iiitbofficial/" id="id-H">
            <FaLinkedinIn style={{ marginRight: '16px' }} color="gray" size={15}/></a>
          </p>
          <p><a className="text-decoration-none" href="https://www.youtube.com/user/iiitbmedia" id="id-J">
            <FaYoutube style={{ marginRight: '16px' }} color="gray" size={15}/></a>
          </p>
        </div>


<div className="footer" style={{fontSize: "10px"}}>
        <div className="" id="id-L">
          <FaRegCopyright size={9} color="white" style={{marginRight: "5px"}}/>
          2024 Copyright: International Institute of Information Technology - Bangalore
          </div>
        <div className="" id="id-N">
          <p>Technical Support -<a className="text-decoration-none" href="mailto:application@iiitb.ac.in" style={{color: "white"}} id="id-P">&nbsp;application@iiitb.ac.in</a></p>
        </div>
</div>
      </div>

      <div id="id-R" className="h-100 w-50">
        <div className="d-flex flex-column h-50" id="id-T">
          <CreateStudent />
        </div>
      </div>
    </div>
  );
}