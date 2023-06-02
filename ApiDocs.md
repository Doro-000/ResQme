# ResQme API Documentation

The ResQme API allows organizations to retrieve information about victims, medical information, and volunteers related to emergency situations from the ResQme service. The API provides various endpoints to access this information based on specific filters.

The base URL for the API is `https://resqme.me/api`

## Table of Contents

1. [Get Victims](#get-victims)
2. [Get Medical Information](#get-medical-information)
3. [Get Volunteers](#get-volunteers)
4. [Get Location Name](#get-location-name)

---

## Get Victims

### Endpoint: `/getVictims`

This endpoint allows users to retrieve information about victims based on specified filters.

#### Request

- Method: `GET`
- Path: `/getVictims`

#### Query Parameters

The following query parameters can be used to filter the results:

- `filter`: JSON string containing filter parameters (optional). The filters are explained in detail in the following secion.
  - ⚠️ The JSON string has to be URL encoded during request.

#### Victims Filter Schema

- `radius`

  - Description: Represents the circular area within a specified radius.
  - Fields:
    - `latitude`: Latitude coordinate of the center point of the radius.
    - `longitude`: Longitude coordinate of the center point of the radius.
    - `distance`: Distance of the radius from the center point.
    - `unit`: Unit of measurement for the distance, valid values are "KM" (kilometers) or "MI" (miles).

- `polygon`

  - Description: Represents a polygon area defined by multiple vertices.
  - Fields:
    - `vertices`: Array of vertices that define the polygon. Each vertex is an array of two numbers representing the latitude and longitude coordinates.

- `time`
  - Description: Represents a time range.
  - Fields:
    - `from`: Start time of the range in ISO 8601 format.
    - `to`: End time of the range in ISO 8601 format. If not provided, the current time is used as the default value.

**Note:** The `radius` and `polygon` fields are mutually exclusive, meaning only one of them can be specified at a time.

#### Example Request

```http
filter={"radius":{"latitude": 37.7749, "longitude": -122.4194, "distance": 10, "unit": "MI"}}

GET https://resqme.me/api/getVictims?filter=%7B%22radius%22%3A%7B%22latitude%22%3A%2037.7749,%20%22longitude%22%3A%20-122.4194,%20%22distance%22%3A%2010,%20%22unit%22%3A%20%22MI%22%7D%7D

```

#### Response

- Status: 200 OK
- Content-Type: application/json

The response will be a JSON array containing victim information.

#### Example Response

```json
[
  {
    "id": "victim1",
    "name": "John Doe",
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "status": "Panic"
  },
  {
    "id": "victim2",
    "name": "Jane Smith",
    "location": {
      "latitude": 37.7739,
      "longitude": -122.4134
    },
    "status": "Panic"
  }
]
```

---

## Get Medical Information

### Endpoint: `/getMedicalInfo`

This endpoint allows users to retrieve medical information for specific victims.

#### Request

- Method: `GET`
- Path: `/getMedicalInfo`

#### Query Parameters

The following query parameters can be used to filter the results:

- `filter`: JSON string containing field `victimIds` that has a list of user Ids.

#### Example Request

```http

filter={"victimIds":["victim1"]}

GET https://resqme.me/api/getMedicalInfo?filter=%7B%22victimIds%22%3A%5B%22victim1%22,%22victim2%22%5D%7D
```

#### Response

- Status: 200 OK
- Content-Type: application/json

The response will be a JSON array containing medical information for the specified victims.

#### Example Response

```json
[
  {
    "id": "victim1",
    "selectedBlood": "AB+",
    "birthDate": "1990-05-15",
    "height": 175.5,
    "weight": 70.2,
    "gender": "Male",
    "allergies": "Pollen, Dust",
    "currentMedications": "Aspirin, Lisinopril",
    "medicalConditions": "Hypertension, Asthma",
    "organDonor": true
  }
]
```

---

## Get Volunteers

### Endpoint: `/getVolunteers`

This endpoint allows users to retrieve information about volunteers based on specified filters.

#### Request

- Method: `GET`
- Path: `/getVolunteers`

#### Query Parameters

The following query parameters can be used to filter the results:

- `filter`: JSON string containing filter parameters (optional)
  - The fields of `filter` are exactly the same with the `/  getVictims` endpoint with one additional field `type` specifying if we want independent volunteers or professional search and rescue members.

#### Example Request

```http
filter={"radius":{"latitude": 37.7749, "longitude": -122.4194, "distance": 10, "unit": "MI"}, "type": "ProSAR"}

GET https://resqme.me/api/getVolunteers?filter=%7B%22radius%22%3A%7B%22latitude%22%3A%2037.7749,%20%22longitude%22%3A%20-122.4194,%20%22distance%22%3A%2010,%20%22unit%22%3A%20%22MI%22%7D,%20%22type%22%3A%20%22ProSAR%22%7D
```

####

Response

- Status: 200 OK
- Content-Type: application/json

The response will be a JSON array containing volunteer information.

#### Example Response

```json
[
  {
    "id": "volunteer1",
    "name": "Sarah Johnson",
    "location": {
      "latitude": 37.7759,
      "longitude": -122.4179
    },
    "type": "ProSAR"
  },
  {
    "id": "volunteer2",
    "name": "Michael Smith",
    "location": {
      "latitude": 37.7769,
      "longitude": -122.4199
    },
    "type": "ProSAR"
  }
]
```

---

This concludes the documentation for the Resqme.me API. Use the provided endpoints to retrieve information about victims, medical information, and volunteers in emergency situations.
