"use strict";

/* All the on click events that occur in the application */
var main = function () {

    $("#loginmodal").on("click", function () {
        $("#modal2").openModal();
        $("#log").on("click", function () {
            login();
        });
    });

    $("#newusermodal").on("click", function () {

        $("#modal1").openModal();
        $("#reg").on("click", function () {
            signup();
        });
    });

    $("#profile").on("click", function () {
        $("#homeContent").addClass("hide");
        $("#mainDiv").removeClass("hide");
        $("#personalDetails").removeClass("hide");
    });

    $("#editFname").on("click", function () {
        $("#fNameTxt").addClass("hide");
        $("#fNamDiv").removeClass("hide");
    });

    $("#editLname").on("click", function () {
        $("#lNameTxt").addClass("hide");
        $("#LNamDiv").removeClass("hide");
    });

    $("#editAbtMe").on("click", function () {
        $("#abtMeTxt").addClass("hide");
        $("#abtMeDiv").removeClass("hide");
    });

    $("#editFavBok").on("click", function () {
        $("#favBokTxt").addClass("hide");
        $("#favBokDiv").removeClass("hide");
    });

    $("#signout").on("click", function () {
        var currentuser = getCookie("username");
        console.log("currentuser" + currentuser);
        deletecookie(currentuser);
        location.reload(true);
        console.log("currentuser" + currentuser);
    });

    $(".dropdown-button").dropdown({ hover: false });
};

$("#save").on("click", function () {
    updateUsrDetails(username);
});

$("#rel").on("click", function () {
    location.reload();
});

/* This function will set the cookie value */
function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 1 * 20 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

/* This function will get the cookie value */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/* This function will Log out the user */
function deletecookie(name) {
    console.log("deletecookie" + name);
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

/* This function adds the book to the bookshelf */
function addBook(name) {
    var obj = JSON.parse('{"title" : "' + name + '"}');
    console.log(obj);
    var u = getCookie("username");
    $.ajax({
        url: "http://localhost:3000/update_bookshelf/" + u,
        type: "POST",
        datatype: "json",
        contentType: "Application/Json",
        data: JSON.stringify(obj),
        success: function () {
            getUserDetails(u);
        },
        error: function (error) {
            console.log(error);
        }
    });

}

/* The search functionality */
document.getElementById("search").addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        var bookname = $("#search").val();
        var obj = JSON.parse('{"bookname" :"' + bookname + '"}');
        $.ajax({
            url: "http://localhost:3000/books",
            type: "POST",
            dataType: "json",
            contentType: "Application/Json",
            data: JSON.stringify(obj),
            success: function (data) {
                console.log(data);
                if (data !== null) {

                    console.log("SUCCESS");

                    console.log(data);
                    $("#list").empty();
                    $("#test1 .collapsible").empty();
                    $("#test1").removeClass("hide");
                    $("#mainDiv").addClass("hide");
                    var str = "";
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        str += "<li><div class=\"collapsible-header\">";
                        if (item.title) {
                            str += item.title;
                        }
                        str += "</div><div id=\"bagColor\" class=\"collapsible-body\"><div class=\"col s6\"><img id=\"bookImg\" class=\"materialboxed\" width=\"200\"";
                        if (item.thumbnail) {
                            str += "src=" + item.thumbnail + ">";
                        } else {
                            str += "src=Images/default.jpg>";
                        }
                        str += "</div><div class=\"col s6\" id=\"desc\">";
                        if (item.description) {
                            str += item.description;
                        } else {
                            str += "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
                        }
                        if (item.averageRating === undefined) {
                            item.averageRating = 0;
                        }
                        str += "<br><br></div><p>Average Rating: " + item.averageRating + "</p><a onClick=\"addBook(\'" + item.title + "');\" class=\"waves-effect waves-light btn\">Add to BOOKSHELF</a><br><br><br>";
                        str += "<a target=\"_blank\" href=\'" + item.previewLink + "'\ class=\"waves-effect waves-light btn \">Preview</a><br><br>"
                        str += "<br><a target=\"_blank\" href=\'" + item.infoLink + "'\>More Info</a><br><br></div></li>"
                    }
                    console.log(str);
                    $("#test1 .collapsible").append(str);
                } else {
                    console.log("FAILURE");
                }
            },
            failure: function (errMsg) {
                console.log(errMsg);
            }
        });

    }
});

/* Sign up functionality */
function signup() {
    var fname = document.getElementById("firstName").value;
    var lname = document.getElementById("lastName").value;
    var email = document.getElementById("emailId").value;
    var name = document.getElementById("userName").value;
    var pwd = document.getElementById("password").value;
    var j = JSON.parse('{"username":"' + name + '","password":"' + pwd + '","firstname":"' + fname + '","lastname":"' + lname + '","email":"' + email + '"}');
    console.log(j);
    $("#userName").val("   ");
    $("#firstName").val("");
    $("#lastName").val("");
    $("#emailId").val("");
    $("#password").val("");
    $.ajax({
        url: "http://localhost:3000/Signup",
        type: "POST",
        dataType: "json",
        contentType: "Application/Json",
        data: JSON.stringify(j),
        success: function (data) {
            console.log(data.Attempt);
            if (data.Attempt === "success") {
                setCookie("username", name);
                $("#modal1").closeModal();
                console.log("SUCCESS");
                $("#newusermodal, #loginmodal").addClass("hide");
                $("#usernameTitleBar").text(name);
                $("#usernameTitleBar").removeClass("hide");
                var u = getCookie("username");
                getUserDetails(u);
                booksList();
            } else {
                console.log("FAILURE");
                $("#errorAlertuname").removeClass("hide");
            }
        },
        failure: function (errMsg) {
        }
    });
}

/* Sign In functionality */
function login() {
    var name = document.getElementById("siuserName").value;
    var pwd = document.getElementById("sipassword").value;
    var j = JSON.parse('{"username":"' + name + '","password":"' + pwd + '"}');
    console.log(j);
    var username = name;
    $("#siuserName").val("   ");
    $("#sipassword").val("");
    $.ajax({
        url: "http://localhost:3000/login",
        type: "POST",
        dataType: "json",
        contentType: "Application/Json",
        data: JSON.stringify(j),
        success: function (data) {
            console.log(data.Attempt);
            if (data.Attempt === "success") {
                alert("Succesfully Logged In");
                setCookie("username", name);
                name = getCookie("username");
                console.log("second time" + name);
                $("#modal2").closeModal();
                $("#newusermodal, #loginmodal").addClass("hide");
                $("#usernameTitleBar").text(username);
                $("#usernameTitleBar").removeClass("hide");
                getUserDetails(name);
                booksList("Success");
                console.log("Success");
            }
            else {
                $("#modalsigninerror").removeClass("hide");
                console.log(" Login Failed");
            }
        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });
}

/* Profile Page functionality */
function getUserDetails(username) {
    var obj = JSON.parse('{"username":"' + username + '"}');
    $.ajax({
        url: "http://localhost:3000/userinfo/" + username,
        type: "GET",
        dataType: "JSON",
        contentType: "Application/json",
        success: function (data) {
            if (data !== "") {
                console.log(data.Attempt);
                var firstName = data.Attempt.firstname;
                var lastName = data.Attempt.lastname;
                var userName = data.Attempt.username;
                var email = data.Attempt.email;
                var abtMe = data.Attempt.aboutme;
                var favBok = data.Attempt.favourite;
                var s = "";
                var bookshelf = [];
                for (var i = 0; i < data.Attempt.bookshelf.length; i++) {
                    bookshelf[i] = data.Attempt.bookshelf[i];
                }
                console.log("b" + bookshelf);
                $("#fNameTxt").text(firstName);
                $("#fName").val(firstName);
                $("#lNameTxt").text(lastName);
                $("#lName").val(lastName);
                $("#uNameTxt").text(userName);
                $("#eMailTxt").text(email);
                $("#abtMeTxt").text(abtMe);
                $("#aboutMe").val(abtMe);
                $("#favBokTxt").text(favBok);
                $("#favBok").val(favBok);
                s += "<ol>";
                for (var i = 0; i < data.Attempt.bookshelf.length; i++) {
                    s += "<li>" + bookshelf[i] + "</li>";
                }
                s += "</ol>";
                $("#showuser_bshelf").append(s);
            }
        },
        error: function () {
            console.log("Error getUserDetails!!");
        }
    });
}

/* Updates the user values from the Profile Page */
function updateUsrDetails(username) {
    alert("updateUsrDetails:" + username);
    var firstName = $("#fName").val();
    var lastName = $("#lName").val();
    var userName = $("#uNameTxt").val();
    var email = $("#eMailTxt").val();
    var abtMe = $("#aboutMe").val();
    var favBok = $("#favBok").val();
    var obj = JSON.parse('{"firstname" : "' + firstName + '","lastname" : "' + lastName + '","aboutme" : "' + abtMe + '","favourite" : "' + favBok + '"}');
    $.ajax({
        url: "http://localhost:3000/update/" + username,
        type: "POST",
        datatype: "json",
        contentType: "Application/Json",
        data: JSON.stringify(obj),
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }
    });

}

/* Displays the list of books according to the user login */
function favBooks() {
    $("#mainDiv").addClass("hide");
    var currentuser = getCookie("username");
    $.ajax({
        url: "http://localhost:3000/favbookuser/" + currentuser,
        type: "POST",
        dataType: "json",
        contentType: "Application/Json",
        success: function (data) {
            console.log(data.Attempt);
            if (data) {
                $("#test4 .collapsible").empty();
                var str = "";
                for (var i = 0; i < data.Attempt.length; i++) {
                    var item = data.Attempt[i];
                    str += "<li><div class=\"collapsible-header\">";
                    if (item.title) {
                        str += item.title;
                    }
                    str += "</div><div id=\"bagColor\" class=\"collapsible-body\"><div class=\"col s6\"><img id=\"bookImg\" class=\"materialboxed\" width=\"200\"";
                    if (item.thumbnail) {
                        str += "src=" + item.thumbnail + ">";
                    } else {
                        str += "src=Images/default.jpg>";
                    }
                    str += "</div><div class=\"col s6\" id=\"desc\">";
                    if (item.description) {
                        str += item.description;
                    } else {
                        str += "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
                    }
                    if (item.averageRating == undefined) {
                        item.averageRating = 0;
                    }
                    str += "<p>Average Rating: " + item.averageRating + "</p></div>"
                }
                console.log(str);
                $("#test4 .collapsible").append(str);
            }
            else {
                console.log(" Noo books");
            }
        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });
}

/* Display all the books list on the page */
function booksList() {
    var user = getCookie("username");
    $("#test1 .collapsible").empty();
    $("#test1").removeClass("hide");
    $("#mainDiv").addClass("hide");
    var googleAPI = "https://www.googleapis.com/books/v1/volumes?q=Game+of+thrones";
    $.getJSON(googleAPI, function (response) {
        var str = "";
        for (var i = 0; i < response.items.length; i++) {
            var item = response.items[i];
            str += "<li><div class=\"collapsible-header\">";
            if (item.volumeInfo.title) {
                str += item.volumeInfo.title;
            }
            str += "</div><div id=\"bagColor\" class=\"collapsible-body\"><div class=\"col s6\"><img id=\"bookImg\" class=\"materialboxed\" width=\"200\"";
            if (item.volumeInfo.imageLinks) {
                str += "src=" + item.volumeInfo.imageLinks.thumbnail + ">";
            } else {
                str += "src=Images/default.jpg>";
            }
            str += "</div><div class=\"col s6\" id=\"desc\">";
            if (item.volumeInfo.description) {
                str += item.volumeInfo.description;
            } else {
                str += "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
            }
            // using isbn display book
            if (item.volumeInfo.averageRating == undefined) {
                item.volumeInfo.averageRating = 0;
            }
            str += "<p>Average Rating: " + item.volumeInfo.averageRating + "</p>"
            str += "<a target=\"_blank\" href=\'" + item.volumeInfo.previewLink + "'\ class=\"waves-effect waves-light btn waves-light blue darken-4\">Preview</a><br>"
            str += "<a target=\"_blank\" href=\'" + item.volumeInfo.infoLink + "'\>More Info</a><br><br>"
            if (user) {
                str += "<br><br><a onClick=\"addBook(\'" + item.volumeInfo.title + "');\" class=\"waves-effect waves-light btn waves-light blue darken-4\">Add to BOOKSHELF</a><br><br></div></li>";
            }
        }
        console.log(str);
        $("#test1 .collapsible").append(str);
    });
}

/* Switch between the Genere tab*/
function genresType() {
    $("#test2").removeClass("hide");
    $("#mainDiv").addClass("hide");
    $("#details_view").empty();
}

/* Allows the user to follow another user */
function follow(uname) {
    var currentuser = getCookie("username");
    var j = JSON.parse('{"follow":"' + uname + '"}');
    console.log(j);
    $.ajax({
        url: "http://localhost:3000/follow/" + currentuser,
        type: "POST",
        dataType: "json",
        contentType: "Application/Json",
        data: JSON.stringify(j),
        success: function (data) {
            console.log(data);
            if (data) {
                alert("Succesfully followed");
                $("#button" + uname).addClass("disabled");
                $("#shelf" + uname).removeClass("hide");
                $("#btn-follow" + uname).text("done");
                console.log("Success");
            } else {
                alert("follow Failed");
                console.log(" follow Failed");
            }
        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });
}

/* Back button functionality which is on Profile Page */
function back1() {
    $("#personalDetails").addClass("hide");
    $("#homeContent").removeClass("hide");
}

/* This function will get all the users which one can follow and already has followed*/
function people() {
    var user = getCookie("username");
    $("#test3").removeClass("hide");
    $("#mainDiv").addClass("hide");
    $("#test3 .collection").empty();
    var str = "";
    console.log("people function" + str);
    if (user) {
        $.ajax({
            url: "http://localhost:3000/allusers",
            type: "GET",
            dataType: "json",
            contentType: "Application/Json",
            success: function (data) {
                var data2 = data;
                console.log(data);
                if (data !== null) {
                    var uname = getCookie("username"); //current user
                    console.log(uname);
                    var flag = false;
                    //in that list all users should be seen except current user...so checking that in the if
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        if (item.username !== uname) {
                            str += "<li class=\"collection-item avatar people col s6 offset-s3\"><br>";
                            str += "<img src=\"Images/user.png\" alt=\"no display image\" class=\"circle\">";
                            str += "<span class=\"title\">";
                            if (item.firstname !== null || item.lastname !== null) {
                                str += item.firstname + "  " + item.lastname;
                            }
                            str += "</span><p>";
                            str += item.username;
                            if (item.favourite !== "") {
                                str += "<br><br>Favorite Books: " + item.favourite + "</p>";
                            }
                            var tempdetails = "";
                            //checking if which user already follows, so that i can disable follow button
                            for (var k = 0; k < data2.length; k++) {
                                if (data2[k].username === uname) {
                                    console.log(data2[k]);
                                    console.log(data2[k].follow.length);
                                    tempdetails = data2[k].follow;
                                    break;
                                }
                            }
                            var flag = false;
                            for (var j = 0; j < tempdetails.length; j++) {
                                if (item.username === tempdetails[j]) {
                                    str += "<br><br><div id=\"shelf" + item.username + "\" class=\"show\">Bookshelf: " + item.bookshelf + "</div></p>";
                                    str += "<a id=\"button" + item.username + "\" class=\"disabled waves-effect waves-light btn right\"><i id=\"btn-follow" + item.username + "\" class=\"material-icons left\">done</i>follow</a><br><br></li>";
                                    flag = true;
                                    console.log("following");
                                    break;
                                }
                            }
                            if (flag !== true || tempdetails.length === 0) {
                                str += "<br><br><div id=\"shelf" + item.username + "\" class=\"hide\">Bookshelf: " + item.bookshelf + "</div></p>";
                                str += "<a id=\"button" + item.username + "\" class=\"waves-effect waves-light btn right\" onClick=\"follow(\'" + item.username + "');\"><i id=\"btn-follow" + item.username + "\" class=\"material-icons left\"></i>follow</a><br><br></li>";
                                console.log("not following");
                            }
                        }
                    }
                    $("#test3 .collection").empty();
                    $("#test3 .collection").append(str);
                    console.log(str);
                    console.log("Success");
                } else {
                    alert("follow list Failed");
                    console.log(" follow list Failed");
                }
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    } else {
        $("#test3").addClass("hide");
        $("#mainDiv").removeClass("hide");
    }
}

/* This function finds the specific genres type books */
function find(type) {
    var user = getCookie("username");
    $("#details_view").empty();
    var googleAPI = "https://www.googleapis.com/books/v1/volumes?q=" + type;
    $.getJSON(googleAPI, function (response) {
        var str = "";
        for (var i = 0; i < response.items.length; i++) {
            var item = response.items[i];
            str += "<li><div class=\"collapsible-header\">";
            if (item.volumeInfo.title) {
                str += item.volumeInfo.title;
            }
            str += "</div><div id=\"bagColor\" class=\"collapsible-body\"><div class=\"col s6\"><img id=\"bookImg\" onClick=\"detailBook(\'" + item.id + "');\" class=\"materialboxed\" width=\"200\"";
            if (item.volumeInfo.imageLinks) {
                str += "src=" + item.volumeInfo.imageLinks.thumbnail + ">";
            } else {
                str += "src=Images/default.jpg>";
            }
            str += "</div><div class=\"col s6\" id=\"desc\">";
            if (item.volumeInfo.description) {
                str += item.volumeInfo.description;
            } else {
                str += "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
            }
            if (item.volumeInfo.averageRating === undefined) {
                item.volumeInfo.averageRating = 0;
            }
            str += "<p>Average Rating: " + item.volumeInfo.averageRating + "</p>"
            str += "<a target=\"_blank\" href=\'" + item.volumeInfo.previewLink + "'\ class=\"waves-effect waves-light btn waves-light blue darken-4\">Preview</a><br><br>"
            str += "<br><a target=\"_blank\" href=\'" + item.volumeInfo.infoLink + "'\>More Info</a><br><br>"
            if (user) {
                str += "<br><br><a onClick=\"addBook(\'" + item.volumeInfo.title + "');\" class=\"waves-effect waves-light btn waves-light blue darken-4\">Add to BOOKSHELF</a><br><br></div></li>"
            }
        }
        console.log(str);
        $("#details .collapsible").append(str);
    });
}

$(document).ready(function () {
    var m = getCookie("username");
    main();
    $("#test1").addClass("hide");
    /* Initialization of all the Javascript classes of Matelializecss.*/
    $(".slider").slider({
        full_width: false
    });
    $(".materialboxed").materialbox();
    $(".collapsible").collapsible({
        accordion: false
    });
});