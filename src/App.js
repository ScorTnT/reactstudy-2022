import './App.css';
import {useState} from 'react';

function Header(props){
  return (
    <header>
    <h1>
    <a href="/" onClick={function(event){
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a>
  </h1>
  </header>)
}

function Nav(props) {
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t=props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={"/read/"+t.id} onClick={function(event){
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
    </li>
    )
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Article(props) {
  return (<article>
    <h2>{props.title}</h2>
    {props.body}
  </article>)
}
function Control(props){
  return (<p><a href={`/`+props.name} onClick={function(event){
    event.preventDefault();
    props.setMode(props.name);
  }}>{props.name}</a></p>)
}

function Control_id(props){
  return (<p><a href={`/`+props.name+'/'+props._id} onClick={function(event){
    event.preventDefault();
    props.setMode(props.name);
  }}>{props.name}</a></p>)
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={function(event){
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p>
        <input type="text" name="title" placeholder="title"></input>
      </p>
      <p>
        <textarea name="body" placeholder="body"></textarea>
      </p>
      <p>
        <input type="submit" value="Create"></input>
      </p>
    </form>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props._title);
  const [body, setBody] = useState(props._body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={function(event){
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p>
        <input type="text" name="title" placeholder="title" value={title} onChange={function(event){
          setTitle(event.target.value);
        }}></input>
      </p>
      <p>
        <textarea name="body" placeholder="body" value={body} onChange={function(event){
          setBody(event.target.value);
        }}></textarea>
      </p>
      <p>
        <input type="submit" value="Update"></input>
      </p>
    </form>
  </article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [topics, setTopics] = useState([
    {id:1, title:"html", body:"html is ..."},
    {id:2, title:"css", body:"css is ..."},
    {id:3, title:"js", body:"js is ..."}
  ]);
  const [nextId, setNextId] = useState(topics.length+1);
  var controlCenter = null;
  let content = '';
  if(mode === 'WELCOME'){
    content = <Article title="WELCOME" body="Hello, World"></Article>
    controlCenter=<><Control name="Create" setMode={setMode}></Control></>
  }
  else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
        break;
      }
    }
    content = <><Article title={title} body={body}></Article></>
    controlCenter=<><Control name="Create" setMode={setMode}></Control><Control_id name="Update" id={id} setMode={setMode}></Control_id></>
    var deleteControl=<>
    <input type="button" value="Delete" onClick={function(){
      const newTopics=[];
      for(var i=0; i<topics.length; i++){
        if(topics[i].id !== id){
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></input>
    </>
  }
  else if(mode === 'Create'){
    content=<Create onCreate={function(_title, _body){
      const newTopic = {id:nextId, title:_title, body:_body};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  }
  else if(mode === 'Update'){
    let title, body = null;
      for(let i=0; i<topics.length; i++){
        if(topics[i].id === id){
          title = topics[i].title;
          body = topics[i].body;
        }
      }
    content = <Update _title={title} _body={body} onUpdate={function(title, body){
      const newTopics = [...topics];
      const updatedTopic={id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i]=updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  return (
    <html>
        <div> 
          <body>
            <Header title="React - 2022" onChangeMode={function(){
              setMode('WELCOME');
            }}></Header>
          </body>
          <Nav topics={topics} onChangeMode={function(id){
            setMode('READ');
            setId(id);
          }}></Nav>
          {content}
          {controlCenter}
          {deleteControl}
        </div>
    </html>
  );
}

export default App;