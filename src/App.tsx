// import { withStyles } from '@material-ui/core/styles';
import {Card, CardActionArea, CardContent, CardMedia, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Typography} from '@material-ui/core';
import * as React from 'react';
import './App.css';

import logo from './logo.svg';

interface IState {
  arrayObject: any[],
  entered: any,
  keywords: any,
  obj: any,
  open: any,
  textValue: any,
  toggle: any,
}
class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      arrayObject: [],
      entered: "",
      keywords: "",
      obj: {
        description: "",
        title: "",
        url: "",
      },
      open: false,
      textValue: "",
      toggle: false,
    };

    // this.handleChange = this.handleChange.bind(this);
  }
  public handleChange = (event: any) => {
    this.setState({textValue: event.currentTarget.value});
  }
  public search = async (event: any) => {
    if (event.key === "Enter") {
      this.setState({entered: "", toggle: true});
      const {textValue}:any = this.state;
      const commaSeperated:any = textValue.split(/\s+/g).join(',').toString();
      const data = await this.getStarsData(commaSeperated);
      // console.log(data)
      this.setState({arrayObject: data, toggle:false})
    }
    
  }
  public getStarsData = async (commaSeperated:any) => {
    const url = 'https://images-api.nasa.gov/search?keywords=' + commaSeperated;
    // console.log(url)
    return await fetch(url, {method: 'GET',})
      .then((res) => {
        const array = res.json()
        return array;
      })
      .then((data) => {
        
        const arrayOfData = data.collection.items;
        // console.log(arrayOfData)
        const numOfItems = 30;
        const returnArray = [];
        for (let i=0; i <numOfItems; i++) {
          let max = arrayOfData.length;
          let random = Math.floor(Math.random() * (max - 0 + 1)) + 0;
          // check if image returns 404
          // if 404, get another random
          // else, push

          // push image that returns 200
          
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
                  max = arrayOfData.length;
                } else {
                  random = Math.floor(Math.random() * (max + 1));
                }
              } else {
                random = Math.floor(Math.random() * (max + 1));
              }
            } else {
              added = 1;
            }
            
          }

        }
        return returnArray
      })
  }
  public getImg = async (url:any) => {
    // console.log(url)
    return await fetch(url,{
      method: "GET",
    })
      .then((res) => {
        console.log('ok')
        return res.ok
      })
  }
  // private handleClickOpen = () => {
  //   this.setState({ open: true });
  // };
  public render() {
    const {arrayObject, textValue} : any = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Find various stars with simple keywords!</h1>
          <input className="InputField" style={{width:200, height:25, fontSize:20, margin:3, borderWidth:2, borderColor:'#7CCDEC', borderRadius:3, }} value={textValue} onChange={this.handleChange} onKeyPress={this.search} />
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
            <Card onClick={this.popUp.bind(this,item)} style={{width:345, margin: 'auto'}}>
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

  private handleClose = () => {
    this.setState({ open: false });
  };
  private popUp =(obj:any) => {
    console.log('popup:', obj)
    const newObj = {
      description: obj.data[0].description,
      title: obj.data[0].title,
      url: obj.links[0].href,
    }
    this.setState({obj:newObj, open:true})
  }
  
  
}


export default App;
