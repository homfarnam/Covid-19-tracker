import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

const InfoBoxes = ({ title, cases, total }) => {
  return (
    <Card className='infoBox'>
      <CardContent>
        <Typography className='infoBoxes__title' color="textSecondary">{title}</Typography>

        <h2 className='infoBoxes__cases'>{cases}</h2>

        <Typography className='infoBoxes__total' color="textSecondary">{total} total</Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBoxes;
