import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function ComboBox({coin, currentCoin}) {
  
  return (
    <Autocomplete
      value={coin}
      onChange={(event, newValue) => {
        currentCoin(newValue);
      }}
      disablePortal
      id='combo-box-demo'
      options={userCoin}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label='Your Coin' />}
    />
  );
}

const userCoin = [
  { label: "Bitcoin" },
  { label: "Etherium" },
  { label: "Shiba" },
  { label: "Dodge" },
  { label: "Litecoin" },
];
