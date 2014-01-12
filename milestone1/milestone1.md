Milestone 1
==================

User research
---------------

1. What problem does your application address, and how does your application address it?  
We are addressing the Urban Exploration problem. Our app will allow people to find cool new places in their local vicinity by generating walking/jogging paths that pass by places that fit a user’s interests.   
2. What are the killer features of your application?
We let people discover cool new places in their neighborhood by generating a walking/jogging path that includes random new locations.
3. Identify and briefly describe your target demographic. Who do you envision using your site?
Some demographics include joggers who want to find new routes and people who have just moved into a city and want to explore.
4. Develop at least one use case for your site. This should be a list or table demonstrating a sequence of user actions and website responses that occur when a user attempts to complete a core task on your site. Make sure to indicate the task the user is trying to complete.

<table>
<tr>
<td>**User Actions**</td>
<td>**Website Responses**</td>
</tr>
<tr><td>Enter path start location</td><td></td></tr>
<tr><td></td><td>Suggest a path (with default distance)</td>
<tr><td>Specify distance/time, jogging/walking</td><td></td></tr>
<tr><td></td><td>Regenerate path with longer/shorter distance</td>
<tr><td>Specify location preferences with tags, “more trees”, “restroom” etc</td><td></td></tr>
<tr><td></td><td>Regenerate path with locations that have those qualities</td>
<tr><td>Decides wants a different path, clicks “dice” UI element </td><td></td></tr>
<tr><td></td><td>Create a new path with different locations that have the same tags</td>
<tr><td>Clicks “save path”.</td><td></td></tr>
<tr><td></td><td>Prompts user for login/registration. </td>
<tr><td>Logs in/registers.</td><td></td></tr>
<tr><td></td><td>Prompts user for name of path, stores path in “Saved path” section of User account</td>
</table>



Site Design
--------------------
Think hard about your most complicated page. What are the important features of this page? What usability problems may come up? For your most important page:
Draw out, by hand, three different designs for this page. Scan these for your submission. 
Make a list of 3 pros and 3 cons for each design.

**Prototype 1 **

*Pros*
- Focus on map
- Big buttons
- Easy to select tags

*Cons*
- Inconvenient to search tags
- Fat things that scroll
- Information not on same page

**Prototype 2** 

*Pros*
- All information on same page
- Flat design
- Focus on map
- Time/Distance selection

*Cons*
- Top bar crowded?
- Tag selection too busy
- Variable width tags


**Prototype 3**

*Pros*
- Easy to search tags
- Focus on map
- Flat design

*Cons*
- Placement of scrollbar might be confusing for people with different OS’s
- Hard to make responsive, map might get squished
- No place for menu

Pick the best design and mock it up using an image editing program (i.e. Photoshop or Gimp) or using HTML/CSS. Submit a screenshot of this mockup.


Additional Questions
---------------
Please answer the following questions. Please be succinct as possible.
1. Who is in your team? You may list at most 3 people (4 if you are not competing in the main division). For each member list the full legal name, .edu e-mail, school, major(s), year, and graduate/undergraduate status. For each team member, also indicate whether they are registered to take the class for credit.
2. Which of the themes does your application match best? Be as brief as you can.
3. What technology do you plan to use for your server-side programming (e.g. PHP, Ruby on Rails, etc)?
4. What risks do you envision preventing you from successfully implementing your idea? Consider this an exercise of imagination, not a test of confidence.
5. Are you planning to participate in the competition? If so, are you competing in the main division or the rookie division? Your answer will solely be used for planning purposes.


1. <table>
<tr>
<td>**Name**</td>
<td>**Email**</td>
<td>**School**</td>
<td>**Major**</td>
<td>**Year**</td>
<td>**U/G?**</td>
</tr><tr>
<td>Deena Wang</td>
<td>deenaw@mit.edu</td>
<td>MIT</td>
<td>6-7</td>
<td>2014</td>
<td>U</td>
</tr><tr>
<td>Meng Sun</td>
<td>sunme@mit.edu</td>
<td>MIT</td>
<td>4</td>
<td>2016</td>
<td>G</td>
</tr><tr>
<td>Dustin Doss</td>
<td>ddoss@mit.edu</td>
<td>MIT</td>
<td>6-3</td>
<td>2017</td>
<td>U</td>
</tr>
</table>

2. Theme 1: Urban Living, Exploration, and Transportation
3. We will use Django, and deploy to Heroku.
4. Risks include: 
Our pathfinding algorithm + API calls to Google causing the website to be too slow to be usable. Heroku could have downtime when the judges are looking at the site. We could have version management problems. We could use up our quota of Google API calls and be banned from using their API.
5. We are planning on competing in the rookie division.

Minimal Viable Product
-----------------------
In agile software design, a minimal viable product (MVP), or "simplest thing that works" is a product that encapsulates the essence of your application. This is an opportunity for you to think hard about what features are essential to your application and make sure that it is implementable. By implementing your MVP, you may learn more about your users' preferences or discover unexpected pitfalls.

Remember, an MVP is not just a skeleton. You should make sure that you have made significant progress on your most important features. For example, a site that just implements login is not a valid MVP.

The MVP will be due on 1/22/14, five days before the final product is due. Teams that do not pass the MVP milestone will not be eligible to compete in the main division.

Please answer the following questions about your plan for your MVP:
What features do you plan to implement? How critical are they to the proper functioning of your application?

- Login:      Required  
- Generating a path of up to 8 locations: High  
- Specifying location tags: High  
- Specifying distance of path: Medium  
- Saving paths to user account: High. Otherwise, there’s no point for the login.

What features do you plan to leave out? How critical are they to the proper functioning of your application?

- Mobile app that gives user walking instructions for path: If this app was real, then the mobile app would probably be a critical feature  
- Themed paths, ex “Nature”, “Hipster” that predefine a collection of tags: Low. More of a demo feature to bootstrap users.  
- Create own path: Medium. Not the primary focus of the app, but nice to have  
- Sharing paths with friends: High. Social aspects are important for growing site.  
- Multiple paths on one map: Low.  
- Walking vs running speed: Medium.

Are there any other aspects of your application that are reduced in your MVP? Examples including limited fake datasets, stylistic concerns, security concerns, etc.

- For our MVP, we will be using Facebook/Google login instead of implementing a login system of our own. This will reduce security concerns.
- We will do less integration of other social media sites, such as Facebook or Twitter than a “real” app would have.
- Scalability is not well-considered, particularly in the context of API usage quotas. 

