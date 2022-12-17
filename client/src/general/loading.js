import { Row, Spin } from "antd";
import React from "react";


const Loading = () => {
    return (
        <Row className="loading-container" align={"middle"} justify={"center"} style={{height: '100vh'}}>
            <Spin tip="Loading" size="large" />
        </Row>
    );
}

export default Loading