// import { withStyles } from '@material-ui/core/styles';
import {Card, CardActionArea, CardContent, CardMedia, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Typography} from '@material-ui/core';
import * as React from 'react';
import './App.css';

import logo from './logo.svg';

interface IState {
  arrayObject: any[],
  enterPressed: any,
  keywords: any,
  obj: any,
  open: any,
  shadow: any,
  textValue: any,
  toggle: any,
}
class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      arrayObject: [],
      enterPressed: false,
      keywords: "",
      obj: {
        description: "",
        title: "",
        url: "",
      },
      open: false,
      shadow: 1,
      textValue: "",
      toggle: false,
    };
  }
  public handleChange = (event: any) => {
    this.setState({textValue: event.currentTarget.value});
  }
  public search = async (event: any) => {
    if (event.key === "Enter") {
      this.setState({toggle: true, enterPressed: true});
      const {textValue}:any = this.state;
      const commaSeperated:any = textValue.split(/\s+/g).join(',').toString();
      const data = await this.getStarsData(commaSeperated);
      this.setState({arrayObject: data, toggle:false})
    }
    
  }
  public getStarsData = async (commaSeperated:any) => {
    const url = 'https://images-api.nasa.gov/search?keywords=' + commaSeperated;
    return await fetch(url, {method: 'GET',})
      .then((res) => {
        const array = res.json()
        return array;
      })
      .then((data) => {
        // arrayOfData contains those data retrieved from api
        const arrayOfData = data.collection.items;
        // num of items to retrieve
        const numOfItems = 30;
        const returnArray = [];
        for (let i=0; i <numOfItems; i++) {
          let max = arrayOfData.length;
          let random = Math.floor(Math.random() * (max - 0 + 1)) + 0;
          // check if image returns 404
          // if 404, get another random(index)
          // else, push item to returnValue

          let added = 0
          while (added === 0) {
            if (returnArray.length >=30) {
              added = 1;
            }
            if (arrayOfData.length !== 0) {
              if (arrayOfData[random] !== undefined && arrayOfData[random].links !== undefined) {
                const usable = this.getImg(arrayOfData[random].links[0].href)
                if (usable) {
                  // push arrayOfData[random] to returnArray
                  returnArray.push(arrayOfData[random]);
                  // splice the index from arrayOfData
                  arrayOfData.splice(random,1);
                  // decrement max value so there is no out of index error
                  max = arrayOfData.length;
                } else {
                  // retrieved url returns 404. Grab another random(index)
                  random = Math.floor(Math.random() * (max + 1));
                }
              } else {
                // arrayOfData[random] got no data (the api itself sometimes return undefined)
                // Grab another random(index)
                random = Math.floor(Math.random() * (max + 1));
              }
            } else {
              // there is no data returned. i.e. search text returned 0 objects from api.
              added = 1;
            }
          }
        }
        return returnArray
      })
  }
  public getImg = async (url:any) => {
    return await fetch(url,{
      method: "GET",
    })
      .then((res) => {
        // check if given url actually returns img or not
        return res.ok
      })
  }
  public handleClose = () => {
    this.setState({ open: false });
  };
  public popUp =(obj:any) => {
    // get ready object for pop up and toggle pop up
    const newObj = {
      description: obj.data[0].description,
      title: obj.data[0].title,
      url: obj.links[0].href,
    }
    this.setState({obj:newObj, open:true})
  }
  public onMouseOver = () => this.setState({ shadow: 3 });
  public onMouseOut = () => this.setState({ shadow: 1 });

  public render() {
    const {arrayObject, textValue} : any = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Find various stars with simple keywords!</h1>
          <input placeholder="e.g. Galaxy" className="InputField" style={{width:200, height:25, fontSize:20, margin:3, borderWidth:2, borderColor:'#7CCDEC', borderRadius:3, }} value={textValue} onChange={this.handleChange} onKeyPress={this.search} />
        </header>
        {this.state.toggle? 
          <div style={{padding:10}}>
            <CircularProgress thickness={2} size={30} />
          </div>
          :
          null
        }
        <div style={{flexWrap:'wrap', display:'flex', width:'100%', justifyContent:'center'}}>
        {arrayObject.length !== 0 ?
          arrayObject.map((item:any, index:any) => {
            return (
              <div key={index} style={{padding:10, width:345, }}>
            <Card onClick={this.popUp.bind(this,item)} style={{width:345, margin: 'auto'}} 
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}>
              <CardActionArea>
                <CardMedia
                  className="media"
                  style={{height:300, display:'flex'}}
                  image={item.links[0].href}
                />
                <CardContent style={{height:250}}>
                  <Typography gutterBottom = {true} variant="headline" component="h2">
                    {item.data[0].title}
                  </Typography>
                  <Typography component="p">
                    {item.data[0].description.length>200?
                      item.data[0].description.slice(0, 200) + '...'
                    :
                      item.data[0].description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            </div>
            )
          })
        
        :
        this.state.enterPressed && !this.state.toggle ?
          <div style={{padding:15, paddingLeft:20, paddingRight:20, marginTop:15, backgroundColor:'lightgrey', borderRadius:3, }}>
            <p style={{color:'#4a4a4a'}}>No value retrieved from given keywords D:</p>
            <p style={{color:'#4a4a4a'}}>Please search again using different keywords!</p>
          </div>
            :
            null
        }
      </div>
      <div>
        <Dialog
          fullScreen={false}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{this.state.obj.title}</DialogTitle>
          <DialogContent>
            <img style={{maxWidth:500, alignItems:'center',}} src={this.state.obj.url} />
            <DialogContentText style={{maxWidth:450, alignContent:'center'}}>
              {this.state.obj.description}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    );
  }
}


export default App;
