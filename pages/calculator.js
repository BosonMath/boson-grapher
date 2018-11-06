import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
// This is the Link API
import Link from 'next/link'
import { Button } from 'reactstrap';
import Layout from '../components/Layout.js'
import GraphingCalc from '../components/GraphingCalc.js'
export default () => (
  <Layout>
    <GraphingCalc></GraphingCalc>
  </Layout>
)