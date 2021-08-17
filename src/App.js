import { useEffect, useState } from 'react';
import './App.css';

function App() {
	const limit = 100;
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const headings = [
		'picture',
		'name',
		'gender',
		'email',
		'dob',
		'location'
	];

	const [users, setUsers] = useState([]);
	const [originalUsers, setOriginalUsers] = useState([]);
	const [lastSorted, setLastSorted] = useState('');

	useEffect(() => {
		fetch(`https://randomuser.me/api/?results=${limit}`)
			.then(response => response.json())
			.then((data) => {
				const results = Array.isArray(data.results) ? data.results : [];

				setUsers(() => results);
				setOriginalUsers(() => results);
			});
	}, []);

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);

		return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
	};

	const sortUserByKey = (users, key) => {
		return users.sort((user1, user2) => {
			if (user1[key] === user2[key]) {
				return 0;
			}

			return user1[key] > user2[key] ? 1 : -1;
		});
	};

	const sortUserByName = (users) => {
		return users.sort((user1, user2) => {
			if (user1.name.first === user2.name.first) {
				return 0;
			}

			return user1.name.first > user2.name.first ? 1 : -1;
		});
	}

	const sortUserByAge = (users) => {
		return users.sort((user1, user2) => {
			return user1.dob.age - user2.dob.age;
		});
	};

	const sortColumn = (key) => {
		setUsers((previous) => {
			let newUsers = [...previous];

			if (lastSorted === key) {
				return newUsers.reverse();
			}

			switch (key) {
				case 'name':
					return sortUserByName(newUsers);
				case 'gender':
				case 'email':
					return sortUserByKey(newUsers, key);
				case 'dob':
					return sortUserByAge(newUsers);
				default:
					return previous;
			}
		});

		setLastSorted(key);
	}

	const filterByName = (e) => {
		const characters = e.target.value;

		if (characters.length === 0) {
			setUsers(() => {
				return originalUsers;
			});

			setLastSorted('');
		} else if (characters.length >= 3) {
			setUsers(() => {
				return [...originalUsers].filter((user) => (
					user.name.first.toLowerCase().includes(characters) || user.name.last.toLowerCase().includes(characters)
				));
			});

			setLastSorted('');
		}
	};

	return (
		<div>
			<div className="filter-container">
				<div className="name-search">
					<label htmlFor="userName">Search by name</label>
					<input name="userName" className="search-input" placeholder="Min 3 characters" onChange={ filterByName }></input>
				</div>
			</div>

			<table>
				<tbody>
					<tr>
						{
							headings.map((heading, idx) => {
								let headingText = '';

								switch (heading) {
									case 'dob':
										headingText = 'Birthday';

										break;
									default:
										headingText = heading;
								}

								return <th key={idx} onClick={() => { sortColumn(heading) }}>{headingText}</th>
							})
						}
					</tr>

					{
						users.map((user, idx) => {
							return <tr key={idx} className={idx % 2 === 0 ? 'even' : 'odd'}>
								{
									headings.map((heading, index) => {
										switch (heading) {
											case 'picture':
												return <td key={index}>
													<img src={user[heading].thumbnail} alt={`${user.name.first} ${user.name.last}`}></img>
												</td>

											case 'gender':
											case 'email':
												return <td key={index}>{user[heading]}</td>

											case 'dob':
												return <td key={index}>
													<div className='multi-data'>
														<span>
															<b>Birthday: </b>
															{formatDate(user[heading].date)}
														</span>

														<span>
															<b>Age: </b>
															{user[heading].age}
														</span>
													</div>
												</td>

											case 'location':
												return <td key={index}>
													<div className='multi-data'>
														<span>
															<b>Street: </b>
															{`${user[heading].street.number} ${user[heading].street.name}`}
														</span>

														<span>
															<b>City: </b>
															{user[heading].city}
														</span>

														<span>
															<b>State: </b>
															{user[heading].state}
														</span>

														<span>
															<b>Postcode: </b>
															{user[heading].postcode}
														</span>
													</div>
												</td>

											default:
												return <td key={index}>{`${user.name.first} ${user.name.last}`}</td>
										}
									})
								}
							</tr>
						})
					}
				</tbody>
			</table>
		</div>
	);

	// const [headings, setHeadings] = useState([]);
	// const [users, setUsers] = useState([]);

	// const flatObject = (obj) => {
	// 	if (!obj) {
	// 		return 'null';
	// 	} else if (typeof obj === 'object') {
	// 		return Object.keys(obj)
	// 			.reduce((arr, key) => {
	// 				let val = flatObject(obj[key]);

	// 				arr.push(`${key}: ${val}`);

	// 				return arr;
	// 			}, [])
	// 			.join(', ');
	// 	} else {
	// 		return obj;
	// 	}
	// };

	// useEffect(() => {
	// 	fetch(`https://randomuser.me/api/?results=${limit}`)
	// 		.then(response => response.json())
	// 		.then(
	// 			(data) => {
	// 				const results = data.results;
	// 				const keys = Object.keys(results[0]);

	// 				setHeadings(() => keys);

	// 				setUsers(() => (
	// 					results.map((person) => {
	// 						return keys.reduce((obj, key) => {
	// 							obj[key] = flatObject(person[key]);

	// 							return obj;
	// 						}, {})
	// 					})
	// 				));

	// 				// let arr = data.results;

	// 				// console.log(arr.sort((first, second) => {
	// 				// 	if (first.gender < second.gender) {
	// 				// 		return -1;
	// 				// 	} else if (first.gender > second.gender) {
	// 				// 		return 1;
	// 				// 	}

	// 				// 	return 0;
	// 				// }));
	// 			},
	// 			(error) => { });
	// }, []);

	// return (
	// 	<div>
	// 		<table>
	// 			<tbody>
	// 				<tr>
	// 					{
	// 						headings.map((heading, idx) => (
	// 							<th key={idx}>{heading}</th>
	// 						))
	// 					}
	// 				</tr>

	// 				{
	// 					users.map((user, idx) => {
	// 						return <tr key={idx}>
	// 							{
	// 								headings.map((heading, index) => (
	// 									<td key={index}>{user[heading]}</td>
	// 								))
	// 							}
	// 						</tr>
	// 					})
	// 				}
	// 			</tbody>
	// 		</table>
	// 	</div>
	// );
}

export default App;
