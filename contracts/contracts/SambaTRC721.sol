// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";

contract SambaTRC721 {

    //Certificate Struct
    struct certificate_struct {
        string wallet;
        string number;
        uint256 price;
        string location;
        string description;
        string collection;
        string date;
        string image;
    }
   //Person Struct
    struct person_struct {
        uint256 userid;
        string username;
        string email;
        string password;
    }
    
    uint256 public _certificate_ids;
    uint256 public _person_ids;
    mapping(uint256 => certificate_struct) public _certificate_uris; //_certificate_ids => (Certificate) certificate_struct
    mapping(uint256 => person_struct) public _person_uris; //_person_ids => (Person) person_struct

   
    //Certificate
    function create_certificate(string memory _claimer,  string memory number, uint256 price,string memory location,string memory description,string memory collection,string memory date, string memory image)
        public
        returns (uint256)
    {
        //Create Certificates into _certificate_uris
        _certificate_uris[_certificate_ids] = certificate_struct(_claimer, number, price, location, description, collection, date, image );
        _certificate_ids++;

        return _certificate_ids;
    }

    function validate_certificate(string memory _claimer,  string memory number)
        public
        view
        returns (string memory)
    {
        for (uint256 i = 0; i < _certificate_ids; i++){
           if (keccak256(bytes(_claimer)) == keccak256(bytes(_certificate_uris[i].wallet)) && (keccak256(bytes(number))) == (keccak256(bytes(_certificate_uris[i].number)))){
                return Strings.toString(i);
           }				
        }
        return "false";
    }


    //Person
    function register_person(string memory username, string memory email, string memory password) public returns (uint256){
        //Regsiter person into _person_uris
        _person_uris[_person_ids] = person_struct(_person_ids,username,email,password );
        _person_ids++;

        return _person_ids; 
    }

    function login_person(string memory email,  string memory password)public view returns (string memory){
        for (uint256 i = 0; i < _person_ids; i++){
           if (keccak256(bytes(email)) == keccak256(bytes(_person_uris[i].email)) && (keccak256(bytes(password))) == (keccak256(bytes(_person_uris[i].password)))){
                return Strings.toString(i);
           }				
        }
        return "false";
    }

   
    function reset_all() public {
      _certificate_ids = 0;
      _person_ids = 0;
      for (uint256 i = 0; i < _certificate_ids; i++)    delete _certificate_uris[i];
      for (uint256 i = 0; i < _person_ids; i++)    delete _person_uris[i];
    }

  function testing() public returns (string memory){
    create_certificate("0x168e007d9f5a794794e40035c5214963cb16bfb7","35", 300,"Dhaka","A T-shirt with the width of 5 \" and height of 7\" and a bag of 40 TRX","T-shirt, bag","2022-10-13T04:06","image url");
    return validate_certificate("0x168e007d9f5a794794e40035c5214963cb16bfb7","35");
  }


}