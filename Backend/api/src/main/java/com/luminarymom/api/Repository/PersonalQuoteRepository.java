package com.luminarymom.api.Repository;

import com.luminarymom.api.Model.PersonalQuote;
import com.luminarymom.api.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalQuoteRepository extends JpaRepository<PersonalQuote, Long> {

    List<PersonalQuote> findByUser(User user);

    int countByUser(User user);

    void deleteByIdAndUser(Long id, User user);

}