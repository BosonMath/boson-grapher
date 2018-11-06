import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
// This is the Link API
import Link from 'next/link'
import { Button } from 'reactstrap';
import Layout from '../components/Layout.js'
import Greeting from '../components/Greeting.js'
const Index = () => (
  <Layout>
    <Greeting></Greeting>
  </Layout>
)

export default Index