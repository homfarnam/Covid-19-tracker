import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import './InfoBoxes.css'

const InfoBoxes = ({ title, cases, isRed,isGreen,total,active,...props}) => {
  return (
    <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'} ${isGreen && 'infoBox--green'}`}>
      <CardContent>
        <Typography className='infoBoxes__title' color="textSecondary">{title}</Typography>

        <h2 className={`infoBoxes__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h2>

        <Typography className='infoBoxes__total' color="textSecondary">{total} total</Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBoxes;