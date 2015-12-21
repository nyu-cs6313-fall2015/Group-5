
#Visualizing Underground Forums

#Authors: 
Autumn Wu (Tebyt), Pan Chen (Tebyt), Maeda Hanafi (theTrueCaptian)

#Image of your application
![alt tag](https://github.com/Tebyt/IV-Project/blob/master/screenshot1.png)

#Description
The goal of Visualizing Underground Forums is to provide an exploratory tool to an investigator interested in such a dataset. We assume that the invstigator has an intention to learn more about the dataset and perhaps even want to pinpoint a certian entity for an investigation and clues. 

We have defined two entities in this application: 1) the forum users and 2) the forum threads/posts. Each entity is associated with questions and our interface allows the investigator to answer those questions. Moreover, this application allows the investigator to instantly see the relationship between these two entities via instantaneous feedback on clicking either one of the entities.

The questions are as follows:
####Questions about the users
#####Who are the users?
#####When are they active? How often are they active (frequency)?

####Questions about the threads/posts
#####What are the threads and in what forum?
#####How many posts and threads are there within each forum?

####There are also questions that are about both of these entities:
#####For a given user, what are his posts over time?
#####For a given thread, who are the users active in that thread?


#Link to the Video
TODO
#Link to the Demo
https://viz-ug-forum.herokuapp.com/

#Link to the Final Report.
https://docs.google.com/document/d/1GEJRPKSQn9C6MsqHQsrdRlBwiPdV2nJGv20Clql1yoU/edit?usp=sharing 
#Link to the data (if public)
This data is not public for security purposes.

The derived data is also not shared (due to large size) but can be obtained by running transform.py with python. The data that transform.py will use is in /csv, which contains intermediary, derived data from the original dataset.
