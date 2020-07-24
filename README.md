# iCommerce Project
# Designs
## Technologies
- Infrastructure  
  - **Kubernetes**: Project is designed to run on Kubernetes cluster. It's tested compatible with **Minikube** and **Docker For Desktop**  
  - **Docker**: All the services is configured to be built as docker images to be easier to deploy.  
- Database  
  - **MongoDB**: Database for services, main database info:  
    - Database Name: `icommerce`  
    - Database Port: `27017`  
    - Database Username: `icommerce`  
    - Database Password: `password`  
  - Postgres: Database for Kong API gateway  
- Routing  
  - **Kong API Gateway**: API Gateway for the microservice systems, can support main feature: `authentication`, `rate limit`, `routing`, `logging`.... Currently, I only use `routing` feature. Kong Gateway exposes 2 main services:  
    - `kong-admin`: rest service for configure service and routing  
    - `kong-proxy`: proxy for incoming requests  
- Implementation  
  - **Bash script**: Mainly use for set up environments.  
  - **Nodejs**: All services are written in `Javascript` on `Nodejs` framework. Since the architect is microservices, we can choose other platforms/languages to implement other services  
  - **Koa**: web framework for Nodejs  
  - **Mongoose**: object modelling for MongoDB  
- CI/CD  
  - **Skaffold**: Handle building, pushing and deploying into Kubernetes cluster  
- Testing  
  - **Jest**
  - **Supertest**
  - **Mockingoose**
  - **Sinon**
  - **sinon-mongoose**
## Architecture design  
![Architecture design](./images/iCommerce-architecture.png)  
**NOTE** Updated to use DB Less mode, Postgres database will be removed
- **Multitier architecture**: I choose 3-tier architecture for the system. Separate the system into 3 different component:  
  - Client: Web browser  
  - Application server: services  
  - Database  
- **Microservice**: I choose microservice architecture for the application server. This approach is a lot better than monolithic architecture.  
  - Better scaling
  - Decoupling services
  - Flexibility
  - ... 
- **API-Gateway pattern**: I choose API gateway pattern help controlling `authentication`, `rate limit`, `analytics`, `logging`....  

## Database design  
![Database design](./images/database-design.png)  
I choose **NoSQL** database MongoDB for faster implementation and easy to append later. The database is designed very simple. At that moment, there're 2 collections (table in relational databases) are:  
- **products**: store all products and products' information.  
- **queries**: store all searchs' information when user search, filter, sort the products.  
- **views**: store all product's views information when user view a product

### Full text search  
There are a feature to search products, I think it should be better if we have **Full text search** feature in **products** table. Because of that, I enable text index for all string in that table. Product's **Search API** will support **Full Text Search**
```js
// kubernetes-manifests/mongodb.yaml
targetDb.products.createIndex( {"$**": "text"} );
```

## Service Implementation
![Service architecture](./images/Service-architect.png)

The architecture of the Service still follow **MVC architecture**. The only change here is I removed the **View** component because the service don't have View. 

- **Controller**: Control all app logics/behavior. This component is separated into 3 sub component:  
  - **Route**: Control routing between incoming request url to appropriate handler.
  - **Controller**: Control handler logic and workflow
  - **Service**: Handle calculation, query data as well as interact with other external APIs.
- **Model**: Model the database, map between database's record into application's objects. Abstract database method for app to use.
## APIs  
All APIs have implemented CRUD actions
| API | Method | Description |
|---|---|---|
| `api/products` | `GET` | Get list products and count of products's properties. **Note**: The counted value is based on result after `full text search`, other filters will not affect. This is match with ecommerce pages. |
| `api/products` | `POST` | Create new products |
| `api/products/:id` | `GET` | Get product by id |
| `api/products/:id` | `PATCH` | Update product |
| `api/products/:id` | `DELETE` | Delete product |
| `api/queries` | `GET` | Get list queries |
| `api/queries` | `POST` | Create new queries record |
| `api/queries/:id` | `GET` | Get query by id |
| `api/queries/:id` | `PATCH` | Update query |
| `api/queries/:id` | `DELETE` | Delete query |
| `api/views` | `GET` | Get list product views |
| `api/views` | `POST` | Create new product view |
| `api/views/:id` | `GET` | Get product view by id |
| `api/views/:id` | `PATCH` | Update product view |
| `api/views/:id` | `DELETE` | Delete view |

### GET `/api/products` URL Parameters
| Params | Type | Value |
|---|---|---|
| query | String | string to search, full text search |
| brand | String | brand to filter, find match |
| category | String | category to filter, find match |
| rating | Int | rating to filter, find gte |
| seller | String | seller to filter, find match |
| price | String | price to filter, format ```js ${min}:${max} ``` |
| sort | String | order the result, format ```js ${field}:${order} ```, order in [`desc`, `asc`] |

### POST/PATCH `/api/products` request body
```js
{
  query: String,
  brand: String,
  description: String,
  categories: array,
  rating: Int,
  seller: String,
  originalprice: Int,
  currentprice: Int
}
```

### GET `/api/queries` URL Parameters
| Params | Type | Value |
|---|---|---|
| query | String | query string to search, full text search |
| category | String | category to filter, find match |
| brand | String | brand to filter, find match |
| rating | Int | rating to filter, find match |
| seller | String | seller to filter, find match |
| minprice | Int | min price to filter, find match |
| maxprice | Int | max price to filter, find match |
| sortby | String | order type to filter, find match |
| sorttype | String | order type to filter, find match |

### POST/PATCH `/api/queries` request body
```js
{
  querystring: String,
  brand: String,
  category: String,
  rating: Int,
  seller: String,
  minprice: Int,
  maxprice: Int,
  sortby: String,
  sorttype: String
}
```

### GET `/api/views` URL Params
| Params | Type | Value |
|---|---|---|
| productid | String | Product id that viewed |

### POST/PATCH `/api/views` request body
```js
{
  productid: String
}
```

**NOTE** URL parameters is case sensitive, please use the correct form in order to get the correct result

### Product query example   
![Example](./images/example.png)

# Build and Deploy  
## Set up environment   
### Prerequisites  
- **kubectl**: This tool is used to interact with the kubernetes cluster. Follow this [link](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to install kubectl on your local machine.  
- **Local Kubernetes Cluster**:  
  - **Minikube**: Follow this [link](https://kubernetes.io/docs/tasks/tools/install-minikube/) to install. After install, start minikube by running:  
  ```sh
    minikube start
  ```
  - **Docker For Desktop**: Download installation file [here](https://www.docker.com/products/docker-desktop). After install, enable kubernetes local cluster.  
- **Skaffold**: Follow this [instruction](https://skaffold.dev/docs/install/)  
- **Docker**: Help building the services' docker images on machine.  
## Build  
- Step 1: Verify cluster is started and `kubectl` can communicate with `Kubernetes master`  
```sh
  kubectl cluster-info
```
- Step 2: Build the services  
  - **Build with skaffold (Tested)**  
  ```sh
    skaffold build
  ```
  - **Build without skaffold (Tested)**  
  ```sh
    # If you use Minikube, uncomment the following command:
    # eval $(minikube docker-env)

    # Run the following command for each service inside services folder
    docker build -t icommerce/${service}-service services/${service}
    # For remote cluster, please push images into some docker hub and update the images' name in yaml files
  ```
## Deploy  
- First deploy resources on cluster  
  - **Deploy with skaffold (Tested)**  
  ```sh
    skaffold run
  ```
  - **Deploy without skaffold (Tested)**  
  ```sh
    kubectl apply -f kubernetes-manifests/
  ```
- Setup the Kong API's routes information  
  **UPDATED** skipped this step since we're using `Kong dbless` now  
  - **For minikube (Tested)**  
  ```sh
    ./setup/kong-routing-setup.sh
  ```
  - **For other clusters (Untested)**: change the `hostname` to accessible url of Kong's admin api.  
## Verify  
- **For minikube (Tested)**: run the following command to open browser  
  ```sh
    minikube service kong-proxy -n kong
  ```
- **Docker deskop (Tested)**: access to `kong-proxy` at `http://localhost:80`
- **Other remote cluster (Untested)s**: run the following command first and then you can access to backend via `http://localhost:80`
  ```sh
  kubectl port-forward --n kong svc/kong-proxy 80:80
  ```

## Unittest
- Go to `services/${service_name}` and run the following command:
```sh
npm test
```

The test's result will looks like
![Test result](./images/unittest.png)
