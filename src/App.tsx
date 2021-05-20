import React from 'react';
import axios, { CancelTokenSource } from 'axios';
import './App.css';
import { Table } from 'reactstrap';

interface IPost {
  id?: number;
  name: string;
  body: string;
}

const defaultPosts: IPost[] = [];

const App: React.FC = (props) => {
  const [posts, setPosts]: [IPost[], (posts: IPost[]) => void] = React.useState(
    defaultPosts
  );

  const [loading, setLoading]: [
    boolean,
    (loading: boolean) => void
  ] = React.useState<boolean>(true);

  const [error, setError]: [string, (error: string) => void] = React.useState(
    ''
  );
  const cancelToken = axios.CancelToken;
  const [cancelTokenSource, setCancelTokenSource]: [
    CancelTokenSource,
    (cancelTokenSource: CancelTokenSource) => void
  ] = React.useState(cancelToken.source());

  const handleCancelClick = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Cancelled operation');
    }
  };

  React.useEffect(() => {
    axios
      .get<IPost[]>('https://jsonplaceholder.typicode.com/comments', {
        
        headers: {
          'Content-Type': 'application/json',
        },
        
      })
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((ex) => {
        const err = axios.isCancel(ex)
          ? 'Request cancelled'
          : ex.code === 'ECONNABORTED'
          ? 'A timeout has occurred'
          : ex.response.status === 404
          ? 'Resource not found'
          : 'An unexpected error has occurred';
        setError(err);
        setLoading(false);
      });
      cancelTokenSource.cancel("User cancelled operation");
  }, []);
  return (



    <div className="App">
      {loading && <button onClick={handleCancelClick}>Cancel</button>}
      <Table dark className = "table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
        {posts.map((post) => (
          <tr key ={post.id}>
            <td>{post.name}</td>
            <td>{post.body}</td>
          </tr>
        ))}
        </tbody>
    </Table>
    {error && <p className="error">{error}</p>}
    </div>
  );
};

export default App;