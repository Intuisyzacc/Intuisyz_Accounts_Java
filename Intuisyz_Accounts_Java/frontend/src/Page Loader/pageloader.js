import React from 'react';
import pageloadImg from '../Image/gif5.gif';
// import pageloadImg from '../Image/4V0b1.gif';
import './pageloadcss.css';

function PageLoader() {
  return (
    <div className="pageLoader">
      <img
        id="loadingImageSec"
        src={pageloadImg}
        alt="Loading..."
        width="300"
        height="100"
      />

      {/* <span className="pageLoaderContent">Loading ...</span> */}
    </div>
  );
}

export default PageLoader;
